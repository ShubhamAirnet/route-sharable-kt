import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSetCardComponent } from './flight-set-card.component';

describe('FlightSetCardComponent', () => {
  let component: FlightSetCardComponent;
  let fixture: ComponentFixture<FlightSetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightSetCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
