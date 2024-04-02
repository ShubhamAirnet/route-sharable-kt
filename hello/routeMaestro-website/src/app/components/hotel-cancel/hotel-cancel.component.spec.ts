import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCancelComponent } from './hotel-cancel.component';

describe('HotelCancelComponent', () => {
  let component: HotelCancelComponent;
  let fixture: ComponentFixture<HotelCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
