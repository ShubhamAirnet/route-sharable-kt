import { TestBed } from '@angular/core/testing';

import { PlanCheckoutService } from './plan-checkout.service';

describe('PlanCheckoutService', () => {
  let service: PlanCheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanCheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
