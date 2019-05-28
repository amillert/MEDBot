import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DoctorsService } from 'src/app/services/accounts/doctors.service';
import { PatientsService } from 'src/app/services/accounts/patients.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-patient',
  templateUrl: './manage-patient.component.html',
  styleUrls: ['./manage-patient.component.css']
})
export class ManagePatientComponent implements OnInit {
  loading: boolean;
  patients: any[];
  doctors: any[];
  doctor: any[];
  patient: any[];
  patientForm: FormGroup;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private dService: DoctorsService, private service: PatientsService) { }

  ngOnInit() {
    this.getAllDoctors();
    this.getPatient();
    this.patientForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      doctor: ['']
    });
  }

  private getPatient() {
    this.service.get(this.activatedRoute.snapshot.url[1].path)
      .subscribe(patient => {
        this.patient = patient['patient'];
        this.doctor = patient['patient'].doctor;
        if (this.doctor == null) {
          this.doctor = [{
            'id': '',
            'firstName': '',
            'lastName': ''
          }]
        }
      });
  }

  private getAllDoctors() {
    this.loading = true;
    this.dService.getAll()
      .subscribe(doctors => {
        this.doctors = doctors['Doctors'];
        this.loading = false;
        for (let i = this.doctors.length - 1; i >= 0; i--) {
          if (this.doctors[i]['id'] === this.doctor['id']) {
            this.doctors.splice(i, 1);
          }
        }
      });
  }

  get formControls() { return this.patientForm.controls; }

  onSubmit() {
    let doctorID = this.formControls.doctor.value.id
    if (doctorID == undefined) {
      doctorID = this.doctor['id']
    }

    let patient = {
      id: this.activatedRoute.snapshot.url[1].path,
      email: this.formControls.email.value,
      firstName: this.formControls.firstName.value,
      lastName: this.formControls.lastName.value,
      doctorID: doctorID
    }
    this.service.update(patient)
      .subscribe(updatedPatient => {
        this.router.navigate(['/patients']);
      });
  }

}
