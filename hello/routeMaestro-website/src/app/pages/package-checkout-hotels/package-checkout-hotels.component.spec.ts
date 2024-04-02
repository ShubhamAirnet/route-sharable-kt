import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCheckoutHotelsComponent } from './package-checkout-hotels.component';

describe('PackageCheckoutHotelsComponent', () => {
  let component: PackageCheckoutHotelsComponent;
  let fixture: ComponentFixture<PackageCheckoutHotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageCheckoutHotelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageCheckoutHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
