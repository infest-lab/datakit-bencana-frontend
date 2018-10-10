import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointDemandsComponent } from './point-demands.component';

describe('PointDemandsComponent', () => {
  let component: PointDemandsComponent;
  let fixture: ComponentFixture<PointDemandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointDemandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointDemandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
