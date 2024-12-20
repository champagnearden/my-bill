import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from '../components/errors/error404/error404.component';
import { Error500Component } from '../components/errors/error500/error500.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './router.module';

@NgModule({
  declarations: [Error404Component, Error500Component],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
  ],
})
export class ErrorModule {}

