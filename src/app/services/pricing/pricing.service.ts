import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { prices } from '../../../assets/pricing-data';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  constructor(private http: HttpClient) { }

  getPricingData(): Observable<any> {
    return of(prices);
  }
}
