import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelImagesSliderComponent } from './hotel-images-slider.component';

describe('HotelImagesSliderComponent', () => {
  let component: HotelImagesSliderComponent;
  let fixture: ComponentFixture<HotelImagesSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelImagesSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelImagesSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
