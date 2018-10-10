import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointSuppliesComponent } from './point-supplies.component';

describe('PointSuppliesComponent', () => {
  let component: PointSuppliesComponent;
  let fixture: ComponentFixture<PointSuppliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointSuppliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
