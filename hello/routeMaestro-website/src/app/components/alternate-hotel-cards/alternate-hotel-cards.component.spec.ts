import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternateHotelCardsComponent } from './alternate-hotel-cards.component';

describe('AlternateHotelCardsComponent', () => {
  let component: AlternateHotelCardsComponent;
  let fixture: ComponentFixture<AlternateHotelCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlternateHotelCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlternateHotelCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
