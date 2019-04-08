import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/services/accounts/patients.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  loading = false;
  patients: any[];
  addPatientForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private service: PatientsService) {
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
      lastName: this.formControls.lastName.value
    }

    this.service.addPatient(patient)
      .subscribe(
        newPatient => {
          this.getAllPatients();
        },
        (error) => {
          throw error;
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
    this.service.getAll()
      .subscribe(patients => { this.patients = patients['patients']; this.loading = false });
  }
}
