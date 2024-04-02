import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellerCardComponent } from './traveller-card.component';

describe('TravellerCardComponent', () => {
  let component: TravellerCardComponent;
  let fixture: ComponentFixture<TravellerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravellerCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravellerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
