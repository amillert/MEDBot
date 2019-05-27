import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/services/accounts/patients.service';
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
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]],
      firstName: ['', [
        Validators.required,
        Validators.pattern('^[A-Z]{1}[a-ząćęłńóśćżź]*( [A-Z]{1}[a-z]*)*')
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern('^[A-ZĄĆĘŁŃÓŚĆŹŻ]{1}[a-z]*([-][A-Z]{1}[a-z]*)*')
      ]],
      agree: [false, [
        Validators.requiredTrue]]
    });

    this.addPatientForm.valueChanges.subscribe()

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
        });
    this.addPatientForm.reset();
  }

  managePatient(url, id) {
    this.router.navigate([url, id]);
  }

  updatePatient(patient) {
    this.service.update(patient)
      .subscribe();
  }

  deletePatient(patient) {
    this.service.delete(patient.id).subscribe(
      updatedPatient => {
        this.getAllPatients();
      });
  }

  unAssign(patient) {
    let req = {
      id: patient.id,
      email: patient.email,
      firstName: patient.firstName,
      lastName: patient.lastName,
      doctorID: 'unAssign'
    }
    this.service.update(req)
      .subscribe(
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
          if (element.doctor == null) {
            this.areFreePatients = true;
            this.freePatients.push(element);
          }
          else if (JSON.parse(localStorage.getItem('currentUser')).userID == element.doctor.id) {
            this.myPatients.push(element)
          }
        });
        this.loading = false;
      });
  }

  get email() {
    return this.addPatientForm.get('email');
  }

  get firstName() {
    return this.addPatientForm.get('firstName');
  }

  get lastName() {
    return this.addPatientForm.get('lastName');
  }

  get agree() {
    return this.addPatientForm.get('agree');
  }

}
