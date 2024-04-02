import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSidebarComponent } from './input-sidebar.component';

describe('InputSidebarComponent', () => {
  let component: InputSidebarComponent;
  let fixture: ComponentFixture<InputSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
