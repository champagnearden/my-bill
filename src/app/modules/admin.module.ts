import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './router.module';
import { AdminHomeComponent } from '../components/admin/home/admin-home.component';
import { PricesComponent } from '../components/admin/prices/prices.component';
import { UsersComponent } from '../components/admin/users/users.component';
import { AdminService } from '../services/admin/admin.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@NgModule({
  declarations: [
    AdminHomeComponent,
    PricesComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    CanvasJSAngularChartsModule,
  ],
  providers: [AdminService],
})
export class AdminModule {}

