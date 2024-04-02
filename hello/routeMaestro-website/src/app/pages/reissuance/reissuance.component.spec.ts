import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReissuanceComponent } from './reissuance.component';

describe('ReissuanceComponent', () => {
  let component: ReissuanceComponent;
  let fixture: ComponentFixture<ReissuanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReissuanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReissuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
