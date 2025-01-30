import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BillingFormComponent } from './components/billing-form/billing-form.component';
import { BillingResultComponent } from './components/billing-result/billing-result.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AdminHomeComponent } from './components/admin/home/admin-home.component';
import { Error403Component } from './components/errors/error403/error403.component';
import { Error404Component } from './components/errors/error404/error404.component';
import { Error500Component } from './components/errors/error500/error500.component';
import { UsersComponent } from './components/admin/users/users.component';
import { PricesComponent } from './components/admin/prices/prices.component';
import { MeComponent } from './components/me/me.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home page
  { path: 'billing-form', component: BillingFormComponent }, // Form page
  { path: 'billing-form/result', component: BillingResultComponent }, // Result page
  { path: 'contact', component: HomeComponent },
  { path: 'pricing', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'me', component: MeComponent },
  { path: 'admin', component: AdminHomeComponent },
  { path: 'admin/users', component: UsersComponent },
  { path: 'admin/prices', component: PricesComponent },
  { path: 'user', component: AdminHomeComponent },
  { path: '403', component: Error403Component },
  { path: '404', component: Error404Component },
  { path: '500', component: Error500Component },
  { path: '**', redirectTo: '404' } // Redirect unknown routes to error 404 page
];

@Injectable({
  providedIn: 'root',
})
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Prevent route detaching
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // Do nothing
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Always return false to prevent reattaching stored routes
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Return null to prevent retrieval of stored routes
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Decide whether to reuse the route
    return future.routeConfig === curr.routeConfig; // Only reuse if same route
  }
}
