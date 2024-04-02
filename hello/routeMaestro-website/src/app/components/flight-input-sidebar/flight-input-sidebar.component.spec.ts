import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightInputSidebarComponent } from './flight-input-sidebar.component';

describe('FlightInputSidebarComponent', () => {
  let component: FlightInputSidebarComponent;
  let fixture: ComponentFixture<FlightInputSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightInputSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightInputSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
