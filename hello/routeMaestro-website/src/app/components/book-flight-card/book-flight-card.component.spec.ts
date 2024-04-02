import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFlightCardComponent } from './book-flight-card.component';

describe('BookFlightCardComponent', () => {
  let component: BookFlightCardComponent;
  let fixture: ComponentFixture<BookFlightCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookFlightCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookFlightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
