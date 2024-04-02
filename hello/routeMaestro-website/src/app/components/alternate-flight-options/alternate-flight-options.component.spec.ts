import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternateFlightOptionsComponent } from './alternate-flight-options.component';

describe('AlternateFlightOptionsComponent', () => {
  let component: AlternateFlightOptionsComponent;
  let fixture: ComponentFixture<AlternateFlightOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlternateFlightOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlternateFlightOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
