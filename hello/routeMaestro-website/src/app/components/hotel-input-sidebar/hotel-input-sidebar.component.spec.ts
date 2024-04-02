import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelInputSidebarComponent } from './hotel-input-sidebar.component';

describe('HotelInputSidebarComponent', () => {
  let component: HotelInputSidebarComponent;
  let fixture: ComponentFixture<HotelInputSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelInputSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelInputSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
