import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCheckoutComponent } from './package-checkout.component';

describe('PackageCheckoutComponent', () => {
  let component: PackageCheckoutComponent;
  let fixture: ComponentFixture<PackageCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageCheckoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
