import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PricingService } from '../../services/pricing/pricing.service';
import { Router } from '@angular/router';
import { BillDataModel } from '../../../assets/models/bill.model';
import { BillingStateService } from '../../services/billing-state/billing-state.service';

@Component({
  selector: 'app-billing-form',
  templateUrl: './billing-form.component.html',
  styleUrls: ['./billing-form.component.css'],
  standalone: false,
})
export class BillingFormComponent implements OnInit {
  billingForm: FormGroup;
  pricingData: any;
  selectedWebCreation: any;
  selectedMaintenancePlan: any;
  selectedOptions: any[] = [];
  totalPrice: number = 0;
  monthlyPayment: number=0;

  constructor(
      private readonly fb: FormBuilder, 
      private readonly pricingService: PricingService,
      private readonly router: Router,
      private readonly billingState: BillingStateService
    ) {
    this.billingForm = this.fb.group({
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientAddress: ['', Validators.required],
      webCreationType: ['', Validators.required],
      numberOfPages: [1, [Validators.required, Validators.min(1)]],
      selectedOptions: this.fb.array([]),
      maintenancePlan: ['']
    });
  }

  ngOnInit(): void {
    this.pricingService.getPricingData().subscribe(data => {
      this.pricingData = data;
    });

    // Restore the form data if available
    const billingData = this.billingState.billingData();
    if (billingData) {
      this.billingForm.patchValue(billingData);
      this.calculateTotalPrice();
    }
    
    this.billingForm.get('webCreationType')?.valueChanges.subscribe(value => {
      this.selectedWebCreation = this.pricingData?.webCreation.find((wc: any) => wc.type === value);
      this.updateSelectedOptions();
      this.calculateTotalPrice();
    });

    this.billingForm.get('numberOfPages')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });

    this.billingForm.get('selectedOptions')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });

    this.billingForm.get('maintenancePlan')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
  }

  updateSelectedOptions(): void {
    const selectedOptions = this.billingForm.get('selectedOptions') as FormArray;
    selectedOptions.clear();
    if (this.selectedWebCreation?.options) {
      this.selectedWebCreation.options.forEach(() => selectedOptions.push(this.fb.control(false)));
    }
  }

  calculateTotalPrice(): void {
    this.totalPrice = 0;
    if (this.selectedWebCreation) {
      const basePrice = parseFloat(this.selectedWebCreation.basePrice.replace(' €', '').replace(',', '.'));
      const pagePrice = parseFloat(this.selectedWebCreation.pages.replace(' € / page', '').replace(',', '.'));
      const numberOfPages = this.billingForm.get('numberOfPages')?.value || 1;
      this.totalPrice += basePrice + (pagePrice * (numberOfPages - 1));

      const selectedOptions = this.billingForm.get('selectedOptions')?.value;
      selectedOptions.forEach((selected: boolean, index: number) => {
        if (selected) {
          const optionPrice = this.selectedWebCreation.options[index].price;
          if (optionPrice !== 'sur devis') {
            this.totalPrice += parseFloat(optionPrice.replace(' €', '').replace(',', '.'));
          }
        }
      });
    }

    const maintenancePlanName = this.billingForm.get('maintenancePlan')?.value;
    if (maintenancePlanName) {
      const maintenancePlan = this.pricingData?.maintenance.find((mp: any) => mp.name === maintenancePlanName);
      if (maintenancePlan) {
        const maintenancePrice = parseFloat(maintenancePlan.price.replace(' € / mois', '').replace(',', '.'));
        this.totalPrice += maintenancePrice;
        this.monthlyPayment = maintenancePrice;
      }
    }
  }

  get_number_of_true(a:boolean[]):number {
    return a.filter((v) => v === true).length
  }

  onSubmit(): void {
    if (this.billingForm.valid) {
      const formData: BillDataModel = {
        ...this.billingForm.value,
        totalPrice: this.totalPrice,
        monthlyPayment: this.monthlyPayment,
        pricingData: this.pricingData,
        creationDate: new Date(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Set due date to one month from now
        invoiceNumber: Math.floor(Math.random() * 1000000).toString(), // Generate a random invoice number
      };
      // Save to the signal
      this.billingState.setBillingData(formData);
      this.router.navigate(['/billing-form/result']);
      this.billingForm.reset();
    }
  }
}
