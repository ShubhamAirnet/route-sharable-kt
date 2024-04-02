import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCardPackageComponent } from './flight-card-package.component';

describe('FlightCardPackageComponent', () => {
  let component: FlightCardPackageComponent;
  let fixture: ComponentFixture<FlightCardPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightCardPackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightCardPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
