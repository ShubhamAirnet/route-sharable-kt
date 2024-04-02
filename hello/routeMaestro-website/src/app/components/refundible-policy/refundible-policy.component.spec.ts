import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundiblePolicyComponent } from './refundible-policy.component';

describe('RefundiblePolicyComponent', () => {
  let component: RefundiblePolicyComponent;
  let fixture: ComponentFixture<RefundiblePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundiblePolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundiblePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
