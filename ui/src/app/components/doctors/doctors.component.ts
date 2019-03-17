import { Component, OnInit } from '@angular/core';
import { DoctorsService } from 'src/app/services/accounts/doctors.service';
import { BadInput } from 'src/common/bad-input';
import { AppError } from 'src/common/app-error';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {

  doctors: any[];

  constructor(private service: DoctorsService) {
  }

  ngOnInit() {
    this.service.getAll()
      .subscribe(doctors => {this.doctors = doctors; console.log(doctors)});
  }

  createDoctor(input: HTMLInputElement) {
    let doctor = { name: input.value };
    this.doctors.splice(0, 0, doctor);

    input.value = '';

    this.service.create(doctor)
      .subscribe(
        newDoctor => {
          doctor['id'] = newDoctor.id;
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
          console.log(updatedDoctor);
        });
  }

  deleteDoctor(doctor) {
    this.service.delete(doctor.id).subscribe(
      updatedDoctor => {
        console.log(doctor.id + 'deleted');
      });;
  }

}
