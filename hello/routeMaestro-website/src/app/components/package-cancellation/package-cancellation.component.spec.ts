import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCancellationComponent } from './package-cancellation.component';

describe('PackageCancellationComponent', () => {
  let component: PackageCancellationComponent;
  let fixture: ComponentFixture<PackageCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageCancellationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
