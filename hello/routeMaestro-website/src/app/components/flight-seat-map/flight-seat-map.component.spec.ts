import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSeatMapComponent } from './flight-seat-map.component';

describe('FlightSeatMapComponent', () => {
  let component: FlightSeatMapComponent;
  let fixture: ComponentFixture<FlightSeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightSeatMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
