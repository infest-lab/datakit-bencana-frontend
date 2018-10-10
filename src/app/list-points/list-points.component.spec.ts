import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPointsComponent } from './list-points.component';

describe('ListPointsComponent', () => {
  let component: ListPointsComponent;
  let fixture: ComponentFixture<ListPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
