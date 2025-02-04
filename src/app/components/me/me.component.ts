import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeDialogInject, GENDERS} from '../../../assets/models/user.model';
import { AddressModel } from '../../../assets/models/address.model';
import { UserService } from '../../services/user/user.service';
import { AddressesData } from '../address-input/address-input.component';
import intlTelInput from 'intl-tel-input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from '../app/app.component';


@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
  standalone: false,
})
export class MeComponent implements OnInit, AfterViewInit {
  dataModel: MeDialogInject;
  @ViewChild('phone') phone !: ElementRef<HTMLInputElement>;
  informationForm: FormGroup;
  allGenders: string[] = GENDERS;
  iti: any;
  billAddress: AddressModel;
  postAddress: AddressModel;
  
  constructor(
    private readonly fb: FormBuilder, 
    private readonly userService: UserService,
    public dialogRef: MatDialogRef<MeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataModel = { ...data };
    const user = this.dataModel.userInfo;
    this.informationForm = this.fb.group({
      firstName: [user.firstName, Validators.required],
      middleName: [user.middleName],
      lastName: [user.lastName, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      phone: [user.phone.fullNumber.slice(user.phone.dialCode.length+1)],
      gender: [user.gender, Validators.required],
      businessName: [user.businessName, Validators.required],
      billAddress: [user.billAddress],
      postAddress: [user.postAddress],
      username: [user.username, [Validators.required, Validators.pattern(this.dataModel.userInfo.username)]]
    });
    this.billAddress = user.billAddress;
    this.postAddress = user.postAddress;
  }

  async getCountryCode() {
    const ret =  await fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => data.country_code);
    return ret.toLowerCase();
  }

  async ngAfterViewInit(): Promise<void> {
    this.iti = intlTelInput(this.phone.nativeElement, {
      initialCountry: this.dataModel.userInfo.phone.iso2 || await this.getCountryCode(),
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
    if (this.dataModel.from == AppComponent.name) {
      this.informationForm.get('email')?.disable();
      this.informationForm.get('phone')?.disable();
    }
  }

  onAddressSelected(event: AddressesData) {
    this.informationForm.patchValue({
      billAddress: event.billAddress,
      postAddress: event.postAddress
    });
  }

  cancel(): void {
    this.informationForm.reset();
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.informationForm.valid) {
      const ret = this.informationForm.getRawValue();
      ret.phone = {
        iso2: this.iti.getSelectedCountryData().iso2,
        dialCode: this.iti.getSelectedCountryData().dialCode,
        fullNumber:this.iti.getNumber()
      };
      this.dialogRef.close(ret);
      this.informationForm.reset();
    }
  }
}
