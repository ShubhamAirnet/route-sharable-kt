import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityPackageComponent } from './city-package.component';

describe('CityPackageComponent', () => {
  let component: CityPackageComponent;
  let fixture: ComponentFixture<CityPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityPackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
