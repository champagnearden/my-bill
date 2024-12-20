import { Injectable, signal } from '@angular/core';
import { BillDataModel } from '../../../assets/models/bill.model';

@Injectable({
  providedIn: 'root',
})
export class BillingStateService {
  private readonly defaultData: BillDataModel={
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    webCreationType: '',
    numberOfPages: 1,
    selectedOptions: [],
    maintenancePlan: '',
    totalPrice: 0,
    pricingData: null,
    invoiceNumber: '',
    creationDate: new Date(),
    dueDate: new Date(),
    monthlyPayment: 0,
  };
  private readonly billingDataSignal = signal<BillDataModel>(this.defaultData);
  // Get the current billing data signal
  get billingData() {
    return this.billingDataSignal.asReadonly(); // Expose as readonly signal
  }

  // Set the billing data
  setBillingData(data: BillDataModel) {
    this.billingDataSignal.set(data);
  }

  // Clear the billing data
  clearBillingData() {
    this.billingDataSignal.set(this.defaultData);
  }
}
