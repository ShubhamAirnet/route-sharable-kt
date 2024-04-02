import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPackageComponent } from './cancel-package.component';

describe('CancelPackageComponent', () => {
  let component: CancelPackageComponent;
  let fixture: ComponentFixture<CancelPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelPackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
