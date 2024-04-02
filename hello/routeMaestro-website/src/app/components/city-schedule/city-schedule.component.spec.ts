import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityScheduleComponent } from './city-schedule.component';

describe('CityScheduleComponent', () => {
  let component: CityScheduleComponent;
  let fixture: ComponentFixture<CityScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
