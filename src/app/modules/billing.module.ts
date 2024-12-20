import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BillingFormComponent } from '../components/billing-form/billing-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './router.module';
import { BillingResultComponent } from '../components/billing-result/billing-result.component';

@NgModule({
  declarations: [BillingFormComponent, BillingResultComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    CurrencyPipe,
    ReactiveFormsModule
  ],
})
export class BillingModule {}

