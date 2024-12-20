import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BillingFormComponent } from './components/billing-form/billing-form.component';
import { BillingResultComponent } from './components/billing-result/billing-result.component';
import { Error404Component } from './components/errors/error404/error404.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home page
  { path: 'billing-form', component: BillingFormComponent }, // Form page
  { path: 'billing-form/result', component: BillingResultComponent }, // Result page
  { path: 'contact', component: HomeComponent },
  { path: 'pricing', component:HomeComponent },
  { path: '404', component: Error404Component }, 
  { path: '**', redirectTo: '404' } // Redirect unknown routes to error 404 page
];
