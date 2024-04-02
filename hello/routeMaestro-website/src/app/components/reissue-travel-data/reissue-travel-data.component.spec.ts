import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReissueTravelDataComponent } from './reissue-travel-data.component';

describe('ReissueTravelDataComponent', () => {
  let component: ReissueTravelDataComponent;
  let fixture: ComponentFixture<ReissueTravelDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReissueTravelDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReissueTravelDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
