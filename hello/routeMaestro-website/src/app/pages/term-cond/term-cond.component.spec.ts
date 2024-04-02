import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermCondComponent } from './term-cond.component';

describe('TermCondComponent', () => {
  let component: TermCondComponent;
  let fixture: ComponentFixture<TermCondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermCondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermCondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
