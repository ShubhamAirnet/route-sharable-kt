import { TestBed } from '@angular/core/testing';

import { ItineraryServiceService } from './itinerary-service.service';

describe('ItineraryServiceService', () => {
  let service: ItineraryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItineraryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
