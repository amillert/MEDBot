import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDoctorComponent } from './manage-doctor.component';

describe('ManageDoctorComponent', () => {
  let component: ManageDoctorComponent;
  let fixture: ComponentFixture<ManageDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
