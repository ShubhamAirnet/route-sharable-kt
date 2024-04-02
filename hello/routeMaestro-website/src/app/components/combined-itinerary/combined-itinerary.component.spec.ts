import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedItineraryComponent } from './combined-itinerary.component';

describe('CombinedItineraryComponent', () => {
  let component: CombinedItineraryComponent;
  let fixture: ComponentFixture<CombinedItineraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinedItineraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
