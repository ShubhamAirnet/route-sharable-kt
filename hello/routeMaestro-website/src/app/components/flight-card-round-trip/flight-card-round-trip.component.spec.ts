import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCardRoundTripComponent } from './flight-card-round-trip.component';

describe('FlightCardRoundTripComponent', () => {
  let component: FlightCardRoundTripComponent;
  let fixture: ComponentFixture<FlightCardRoundTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightCardRoundTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightCardRoundTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
