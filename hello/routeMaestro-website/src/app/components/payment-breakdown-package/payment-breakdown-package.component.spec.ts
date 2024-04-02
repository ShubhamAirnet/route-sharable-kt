import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBreakdownPackageComponent } from './payment-breakdown-package.component';

describe('PaymentBreakdownPackageComponent', () => {
  let component: PaymentBreakdownPackageComponent;
  let fixture: ComponentFixture<PaymentBreakdownPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBreakdownPackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentBreakdownPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
