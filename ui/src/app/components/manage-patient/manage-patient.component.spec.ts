import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePatientComponent } from './manage-patient.component';

describe('ManagePatientComponent', () => {
  let component: ManagePatientComponent;
  let fixture: ComponentFixture<ManagePatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
