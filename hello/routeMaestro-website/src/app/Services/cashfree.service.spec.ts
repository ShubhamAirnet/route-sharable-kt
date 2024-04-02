import { TestBed } from '@angular/core/testing';

import { CashfreeService } from './cashfree.service';

describe('CashfreeService', () => {
  let service: CashfreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashfreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
