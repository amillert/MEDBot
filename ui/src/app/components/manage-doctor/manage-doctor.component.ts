import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DoctorsService } from 'src/app/services/accounts/doctors.service';
import { PatientsService } from 'src/app/services/accounts/patients.service';

@Component({
  selector: 'app-manage-doctor',
  templateUrl: './manage-doctor.component.html',
  styleUrls: ['./manage-doctor.component.css']
})
export class ManageDoctorComponent implements OnInit {
  loading = false;
  patients: any[];
  doctor: any[];
  doctorPatients = [];
  doctorForm: FormGroup;
  
  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private formBuilder: FormBuilder,
      private service: DoctorsService,
      private Pservice: PatientsService
    ) { }

  ngOnInit() {
    this.getDoctor();
    this.getPatients();
    this.doctorForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      passwordChange: ['']
    });
  }
  get formControls() { return this.doctorForm.controls; }

  onSubmit() {
    let doctor = {
      id: this.activatedRoute.snapshot.url[1].path,
      email: this.formControls.email.value,
      firstName: this.formControls.firstName.value,
      lastName: this.formControls.lastName.value,
      passwordChange: this.formControls.passwordChange.value
    }
    console.log(doctor)
    this.service.update(doctor)
    .subscribe( updatedDoctor => {
      console.log('updated');
      this.router.navigate(['/doctors'])
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
  
  deletePatient(patient) {
    this.Pservice.delete(patient.id).subscribe(
      updatedPatient => {
        this.getPatients();
      });
  }

  private getDoctor() {
    this.loading = true;
    this.service.get(this.activatedRoute.snapshot.url[1].path)
      .subscribe(doctor => {
        this.doctor = doctor['Doctor'];
        console.log(this.doctor);
        this.loading = false;
      });
  }

  private getPatients() {
    this.loading = true;
    this.doctorPatients = [];
    this.Pservice.getAll().subscribe(patients => {
      this.patients = patients['patients'];
      this.patients.forEach(element => {
        console.log(element, this.doctor);
        this.doctorPatients.push(element);
        if (element.doctor == null) {
        }
        else if (this.doctor['id'] === element.doctor.id) {
          this.doctorPatients.push(element);
        }
      });
      console.log(this.doctorPatients);
      this.loading = false;
    });
  }
}
