import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/services/accounts/patients.service';
import { AppError } from 'src/common/app-error';
import { BadInput } from 'src/common/bad-input';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DoctorsService } from 'src/app/services/accounts/doctors.service';
import { Router } from '@angular/router';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  loading = false;
  areFreePatients = false;
  patients: any[];
  
  myPatients = [];
  freePatients = [];
  addPatientForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private dService: DoctorsService,
     private service: PatientsService, private router: Router) {
  }

  ngOnInit() {
    this.addPatientForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.getAllPatients();
  }

  get formControls() { return this.addPatientForm.controls; }

  onSubmit() {
    if (this.addPatientForm.invalid) {
      return;
    }

    let patient = {
      email: this.formControls.email.value,
      firstName: this.formControls.firstName.value,
      lastName: this.formControls.lastName.value,
      doctorID: JSON.parse(localStorage.getItem('currentUser')).userID
    }

    this.service.addPatient(patient)
      .subscribe(
        newPatient => {
          this.getAllPatients();
        },
        (error: AppError) => {
          this.patients.splice(0, 1);
          if (error instanceof BadInput) {
            // this.form.setErrors(error.originalError);
          }
          else throw error;
        });
  }

  managePatient(url, id){
    console.log('test')
    this.router.navigate([url, id]).then( (e) => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });
  }

  updatePatient(patient) {
    this.service.update(patient)
      .subscribe(
        updatedPatient => {
          console.log(updatedPatient);
        });
  }

  deletePatient(patient) {
    this.service.delete(patient.id).subscribe(
      updatedPatient => {
        this.getAllPatients();
      });
  }

  private getAllPatients() {
    this.loading = true;
    this.areFreePatients = false;
    this.myPatients = [];
    this.freePatients = [];
    this.service.getAll()
      .subscribe(patients => {
        this.patients = patients['patients']; 
        this.patients.forEach(element => {
          if (JSON.parse(localStorage.getItem('currentUser')).userID == element.doctor){
            this.myPatients.push(element)
          }
          else if (element.doctor == null){
            this.areFreePatients = true;
            this.freePatients.push(element);
          }
        });
        this.loading = false;
    });
  }

}
