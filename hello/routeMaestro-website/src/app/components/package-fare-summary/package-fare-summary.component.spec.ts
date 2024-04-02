import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageFareSummaryComponent } from './package-fare-summary.component';

describe('PackageFareSummaryComponent', () => {
  let component: PackageFareSummaryComponent;
  let fixture: ComponentFixture<PackageFareSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageFareSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageFareSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
