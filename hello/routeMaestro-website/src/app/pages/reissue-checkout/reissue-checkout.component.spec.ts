import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReissueCheckoutComponent } from './reissue-checkout.component';

describe('ReissueCheckoutComponent', () => {
  let component: ReissueCheckoutComponent;
  let fixture: ComponentFixture<ReissueCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReissueCheckoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReissueCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
