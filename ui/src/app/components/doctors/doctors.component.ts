import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorsService } from 'src/app/services/accounts/doctors.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  addDoctorForm: FormGroup;
  loading = false;
  doctors: any[];

  constructor(private router: Router, private formBuilder: FormBuilder, private service: DoctorsService, private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.addDoctorForm = this.formBuilder.group({
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

    this.getAllDoctors();

    this.addDoctorForm.valueChanges.subscribe()

  }

  get formControls() { return this.addDoctorForm.controls; }

  onSubmit() {
    if (this.addDoctorForm.invalid) {
      return;
    }
    let doctor = {
      email: this.formControls.email.value,
      password: 'abcd',
      firstName: this.formControls.firstName.value,
      lastName: this.formControls.lastName.value
    }
    this.service.addDoctor(doctor)
      .subscribe(
        newDoctor => {
          this.toastrService.success("Doctor has been added");
          this.getAllDoctors()
        });
    this.addDoctorForm.reset();
  }

  updateDoctor(doctor) {
    this.service.update(doctor)
      .subscribe(
        updatedDoctor => {
          this.getAllDoctors()
          this.toastrService.success("Doctor has been updated.")
        });
  }

  deleteDoctor(doctor) {
    this.service.delete(doctor.id).subscribe(
      updatedDoctor => {
        this.getAllDoctors()
        this.toastrService.success("Doctor has been deleted.")
      });
  }

  private getAllDoctors() {
    this.loading = true;
    this.service.getAll()
      .subscribe(doctors => { this.doctors = doctors['Doctors']; this.loading = false; });
  }

  get email() {
    return this.addDoctorForm.get('email');
  }

  get firstName() {
    return this.addDoctorForm.get('firstName');
  }

  get lastName() {
    return this.addDoctorForm.get('lastName');
  }

  get agree() {
    return this.addDoctorForm.get('agree');
  }

  manageDoctor(url, id) {
    this.router.navigate([url, id]);
  }

}
