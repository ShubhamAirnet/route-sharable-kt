import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteOverviewComponent } from './route-overview.component';

describe('RouteOverviewComponent', () => {
  let component: RouteOverviewComponent;
  let fixture: ComponentFixture<RouteOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
