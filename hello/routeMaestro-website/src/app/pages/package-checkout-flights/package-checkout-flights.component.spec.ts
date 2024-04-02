import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCheckoutFlightsComponent } from './package-checkout-flights.component';

describe('PackageCheckoutFlightsComponent', () => {
  let component: PackageCheckoutFlightsComponent;
  let fixture: ComponentFixture<PackageCheckoutFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageCheckoutFlightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageCheckoutFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
