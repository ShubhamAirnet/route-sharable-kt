import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryPreviewComponent } from './itinerary-preview.component';

describe('ItineraryPreviewComponent', () => {
  let component: ItineraryPreviewComponent;
  let fixture: ComponentFixture<ItineraryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItineraryPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
