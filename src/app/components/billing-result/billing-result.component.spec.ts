import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingResultComponent } from './billing-result.component';

describe('BillingResultComponent', () => {
  let component: BillingResultComponent;
  let fixture: ComponentFixture<BillingResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
