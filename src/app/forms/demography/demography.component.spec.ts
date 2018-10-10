import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographyComponent } from './demography.component';

describe('DemographyComponent', () => {
  let component: DemographyComponent;
  let fixture: ComponentFixture<DemographyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemographyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
