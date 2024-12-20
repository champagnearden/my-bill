import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import mockData from '../../../assets/pricing-data.json';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private pricingDataUrl = 'assets/pricing-data.json';

  constructor(private http: HttpClient) { }

  getPricingData(): Observable<any> {
    return of(mockData);
    return this.http.get<any>(this.pricingDataUrl);
  }
}
