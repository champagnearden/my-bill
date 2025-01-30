import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../components/app/app.component';
import { AppRoutingModule } from './router.module';
import { HomeComponent } from '../components/home/home.component';
import { BillingModule } from './billing.module';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../app.routes';
import { LoginModule } from './login.module';
import { MeComponent } from '../components/me/me.component';
import { AddressInputComponent } from "../components/address-input/address-input.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BillingModule,
    LoginModule,
    ReactiveFormsModule,
    AddressInputComponent
  ],
  providers: [
    provideHttpClient(),
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
