import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelDataFlightsComponent } from './travel-data-flights.component';

describe('TravelDataFlightsComponent', () => {
  let component: TravelDataFlightsComponent;
  let fixture: ComponentFixture<TravelDataFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelDataFlightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelDataFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
