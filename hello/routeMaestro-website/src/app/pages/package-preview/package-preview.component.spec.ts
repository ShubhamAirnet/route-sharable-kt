import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagePreviewComponent } from './package-preview.component';

describe('PackagePreviewComponent', () => {
  let component: PackagePreviewComponent;
  let fixture: ComponentFixture<PackagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagePreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
