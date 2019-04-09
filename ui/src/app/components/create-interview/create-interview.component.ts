import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { InterviewService } from 'src/app/services/interview.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { AppError } from 'src/common/app-error';
import { BadInput } from 'src/common/bad-input';
import { PatientsService } from 'src/app/services/accounts/patients.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.css']
})
export class CreateInterviewComponent implements OnInit {
  loading = false;
  interviewForm: FormGroup;
  questions: any[];
  patients: any[];
  myPatients =  [];

  constructor(private router: Router, private fb: FormBuilder, private service: InterviewService, private QService: QuestionsService,
    private PService: PatientsService) {
  }

  ngOnInit() {
    this.interviewForm = this.fb.group({
      patient: [''],
      questions: new FormArray([])
    });
    this.getAllPatients();
    this.getAllQuestions();
  }

  get formControls() { return this.interviewForm.controls; }
  
  onSubmit() {
    let patient = this.formControls.patient.value;
    let arr = this.formControls.questions.value;
    let qids = []
    this.questions.forEach(function (element, i) {
      if (arr[i] === true) {
        qids.push(element.id)
      }
    });
    this.service.addInterview({
      PatientID: patient.id,
      questions: qids
    }).subscribe(
      newDoctor => {
        console.log('created');
      }
    );
    this.router.navigate(['doctors/create-interview']);
  }

  private getAllPatients() {
    this.loading = true;
    this.PService.getAll()
      .subscribe(patients => {
        this.patients = patients['patients'];
        this.patients.forEach(element => {
          if (element.doctor == null){
          }
          else if (JSON.parse(localStorage.getItem('currentUser')).userID == element.doctor.id){
            this.myPatients.push(element)
          }

        });
        console.log(this.myPatients)
        this.loading = false;
      });
  }

  private getAllQuestions() {
    this.loading = true;
    this.QService.getAll()
      .subscribe(questions => {
        this.questions = questions['questions'];
        this.questions.map((o, i) => {
          const control = new FormControl(i === 0); // if first item set to true, else false
          (this.interviewForm.controls.questions as FormArray).push(control);
        });
      });
  }
}
