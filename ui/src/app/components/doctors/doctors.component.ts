import { Component, OnInit } from '@angular/core';
import { DoctorsService } from 'src/app/services/accounts/doctors.service';
import { BadInput } from 'src/common/bad-input';
import { AppError } from 'src/common/app-error';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  addDoctorForm: FormGroup;
  loading = false;
  doctors: any[];

  constructor(private formBuilder: FormBuilder, private service: DoctorsService) {
  }

  ngOnInit() {
    this.addDoctorForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.getAllDoctors();
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
          this.getAllDoctors()
          console.log(doctor);
        },
        (error: AppError) => {
          this.doctors.splice(0, 1);
          if (error instanceof BadInput) {
            // this.form.setErrors(error.originalError);
          }
          else throw error;
        });
  }

  updateDoctor(doctor) {
    this.service.update(doctor)
      .subscribe(
        updatedDoctor => {
          this.getAllDoctors()
          console.log(updatedDoctor);
        });
  }

  deleteDoctor(doctor) {
    this.service.delete(doctor.id).subscribe(
      updatedDoctor => {
        this.getAllDoctors()
        console.log(doctor.id + 'deleted');
      });
  }

  private getAllDoctors() {
    this.loading = true;
    this.service.getAll()
      .subscribe(doctors => { this.doctors = doctors['Doctors']; this.loading = false; console.log(this.loading) });
  }
}
