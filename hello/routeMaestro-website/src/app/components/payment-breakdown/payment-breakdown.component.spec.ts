import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBreakdownComponent } from './payment-breakdown.component';

describe('PaymentBreakdownComponent', () => {
  let component: PaymentBreakdownComponent;
  let fixture: ComponentFixture<PaymentBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBreakdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
