import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes'; // Import routes
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)], // Set up routes with RouterModule
  exports: [RouterModule] // Export RouterModule for use in other modules
})
export class AppRoutingModule {}
