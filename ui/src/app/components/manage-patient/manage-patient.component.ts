import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DoctorsService } from 'src/app/services/accounts/doctors.service';
import { PatientsService } from 'src/app/services/accounts/patients.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-patient',
  templateUrl: './manage-patient.component.html',
  styleUrls: ['./manage-patient.component.css']
})
export class ManagePatientComponent implements OnInit {
  loading = true;
  patients: any[];
  doctors: any[];
  doctor: any[];
  patient: any[];
  patientForm: FormGroup;
  
  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private dService: DoctorsService, private service: PatientsService) { }

  ngOnInit() {
    this.getPatient();
    // this.getAllPatients();
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
        this.loading = false;
      });
  }

  private getAllDoctors() {
    this.loading = true;
    this.dService.getAll()
      .subscribe(doctors => {
      this.doctors = doctors['Doctors'];
      this.loading = false;
    });
  }

  get formControls() { return this.patientForm.controls; }

  onSubmit() {
    // this.questions.forEach(function (element, i) {
    //     element.answer = arr[i];
    //     answers.Answers.push({'questionID': element.question.id, 'answer': arr[i]})
    // });
    let patient = {
      email: this.formControls.email.value,
      firstName: this.formControls.firstName.value,
      lastName: this.formControls.lastName.value,
      doctor: this.formControls.doctor.value
    }
    console.log(patient)
    // this.service.answerInterview(patientid, interviewid, answers)
    // .subscribe( answeredInterview => {
    //   console.log('answered');
    //   this.router.navigate(['/'])
    // });
  }

}
