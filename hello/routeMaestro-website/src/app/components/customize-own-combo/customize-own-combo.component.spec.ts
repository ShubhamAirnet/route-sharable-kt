import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeOwnComboComponent } from './customize-own-combo.component';

describe('CustomizeOwnComboComponent', () => {
  let component: CustomizeOwnComboComponent;
  let fixture: ComponentFixture<CustomizeOwnComboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizeOwnComboComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizeOwnComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
