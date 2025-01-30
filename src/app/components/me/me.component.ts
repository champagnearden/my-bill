import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '../../../assets/models/user.model';
import { DefaultAddress } from '../../../assets/models/address.model';
import { UserService } from '../../services/user/user.service';
import { AddressesData } from '../address-input/address-input.component';
import { PHONE_REGEX, GENDERS } from '../../../environments/environment';
import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from 'intl-tel-input';


@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
  standalone: false,
})
export class MeComponent implements OnInit, AfterViewInit {
  @ViewChild('phone') phone !: ElementRef<HTMLInputElement>;
  informationForm: FormGroup;
  addresses: AddressesData = {
    billAddress: DefaultAddress,
    postAddress: DefaultAddress
  }
  allGenders: string[] = GENDERS;
  
  constructor(
    private readonly fb: FormBuilder, 
    private readonly router: Router,
    private readonly userService: UserService,
  ) {
    this.informationForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      businessName: ['', Validators.required]
    });
  }

  async getCountryCode() {
    const ret =  await fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => data.country_code);
    return ret.toLowerCase();
  }
  async ngAfterViewInit(): Promise<void> {
    intlTelInput(this.phone.nativeElement, {
      initialCountry: await this.getCountryCode(),
      separateDialCode: true,
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js",
    });
    const parent = this.phone.nativeElement.parentElement;
    parent?.classList.add("form-floating");
    const label = document.createElement("label");
    label.setAttribute("for", "phone");
    label.textContent = "Phone";
    label.classList.add("form-label");
    const divNephew = parent?.firstChild?.firstChild as Element;
    if (!divNephew) return;
    const computedWidth = window.getComputedStyle(divNephew, null).getPropertyValue("width").split("px")[0];
    label.setAttribute("style", `left: ${Number(computedWidth)}px;`)
    parent?.appendChild(label);
  }

  ngOnInit(): void {
    const user: UserModel = this.userService.userData();
    if (user) {
      this.informationForm.patchValue({
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        businessName: user.businessName,
        regionalPhoneCode: user.regionalPhoneCode.toString()
      });
      user.email ? this.informationForm.get('email')?.disable() : this.informationForm.get('email')?.enable();
      user.phone ? this.informationForm.get('phone')?.disable() : this.informationForm.get('phone')?.enable();
    }
  }

  onAddressSelected(event: AddressesData) {
    this.informationForm.patchValue({
      addresses: event
    });
    this.addresses = event;
  }

  onSubmit(): void {
    if (this.informationForm.valid) {
      const user = this.userService.userData();
      user.gender = this.informationForm.value.gender;
      user.firstName = this.informationForm.value.firstName;
      user.middleName = this.informationForm.value.middleName;
      user.lastName = this.informationForm.value.lastName;
      user.businessName = this.informationForm.value.businessName;
      user.billAddress = this.addresses.billAddress;
      user.postAddress = this.addresses.postAddress;
      // Save to the signal
      this.userService.setUserData(user);
      this.router.navigate(['/']);
      this.informationForm.reset();
    }
  }
}
