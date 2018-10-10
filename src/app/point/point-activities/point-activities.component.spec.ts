import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointActivitiesComponent } from './point-activities.component';

describe('PointActivitiesComponent', () => {
  let component: PointActivitiesComponent;
  let fixture: ComponentFixture<PointActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
