import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DoctorsService } from 'src/app/services/accounts/doctors.service';
import { PatientsService } from 'src/app/services/accounts/patients.service';

@Component({
  selector: 'app-manage-patient',
  templateUrl: './manage-patient.component.html',
  styleUrls: ['./manage-patient.component.css']
})
export class ManagePatientComponent implements OnInit {
  doctors: any[];
  loading = false;

  constructor(private formBuilder: FormBuilder, private dService: DoctorsService, private service: PatientsService) { }

  ngOnInit() {
    this.getAllDoctors();
  }

  private getAllDoctors() {
    this.loading = true;
    this.dService.getAll()
      .subscribe(doctors => { this.doctors = doctors['Doctors']; this.loading = false; console.log(this.loading)});
  }
}
