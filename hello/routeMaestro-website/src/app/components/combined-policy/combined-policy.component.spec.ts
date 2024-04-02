import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedPolicyComponent } from './combined-policy.component';

describe('CombinedPolicyComponent', () => {
  let component: CombinedPolicyComponent;
  let fixture: ComponentFixture<CombinedPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinedPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
