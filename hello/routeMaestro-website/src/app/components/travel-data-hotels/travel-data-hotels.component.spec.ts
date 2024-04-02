import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelDataHotelsComponent } from './travel-data-hotels.component';

describe('TravelDataHotelsComponent', () => {
  let component: TravelDataHotelsComponent;
  let fixture: ComponentFixture<TravelDataHotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelDataHotelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelDataHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
