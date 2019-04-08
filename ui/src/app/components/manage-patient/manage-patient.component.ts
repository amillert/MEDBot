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
  loading = false;
  patients: any[];
  doctors: any[];
  doctor: any[];
  patient: any[];
  patientForm: FormGroup;
  
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private dService: DoctorsService, private service: PatientsService) { }

  ngOnInit() {
    this.getPatient();
    this.getAllDoctors();
    this.patientForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      doctor: ['']
    });
  }

  private getPatient() {
    this.loading = true;
    this.service.get(this.activatedRoute.snapshot.url[1].path)
      .subscribe(patient => {
        this.patient = patient['patient'];
        this.doctor = patient['patient'].doctor;
        if (this.doctor == null) {
            console.log('null Doctor')
            this.doctor = [{
              'id': '',
              'firstName':'',
              'lastName': ''
            }]
        }
        this.loading = false;
      });
  }

  private getAllDoctors() {
    this.loading = true;
    this.dService.getAll()
      .subscribe(doctors => {
      this.doctors = doctors['Doctors'];
    });
  }

  get formControls() { return this.patientForm.controls; }

  onSubmit() {
    let doctorID = this.formControls.doctor.value.id
    if (doctorID == undefined) {
      doctorID = this.doctor['id']
      console.log(doctorID)
    }

    let patient = {
      id: this.activatedRoute.snapshot.url[1].path,
      email: this.formControls.email.value,
      firstName: this.formControls.firstName.value,
      lastName: this.formControls.lastName.value,
      doctorID: doctorID
    }
    console.log(patient)
    this.service.update(patient)
    .subscribe( updatedPatient => {
      console.log('updated');
      this.router.navigate(['/'])
    });
  }

}
