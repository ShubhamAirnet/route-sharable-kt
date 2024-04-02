import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutFooterComponent } from './without-footer.component';

describe('WithoutFooterComponent', () => {
  let component: WithoutFooterComponent;
  let fixture: ComponentFixture<WithoutFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithoutFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithoutFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
