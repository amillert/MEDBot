import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { PatientInterviewService, Message } from 'src/app/services/patient-interview.service';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'app-answer-interview',
  templateUrl: './answer-interview.component.html',
  styleUrls: ['./answer-interview.component.css']
})
export class AnswerInterviewComponent implements OnInit {
  interview: any[];
  questions: any[];
  interviewForm: FormGroup;
  mensaje: String;
  messages: Message[];
  
  loading = false;
  constructor(private router: Router, private fb: FormBuilder,
    private activatedRoute: ActivatedRoute, private service: PatientInterviewService ) { }

  ngOnInit() {
    this.interviewForm = this.fb.group({
      questions: new FormArray([])
    });
    this.messages = [];
    this.getInterview();
  }
  
  sendMessage(input) {
    let usrMsg = new Message(input.value, "user");
    this.messages.push(usrMsg);
    this.service.converse(usrMsg).subscribe(resp => {
      let botMsg = new Message(resp, "medbot");
      console.log(botMsg);
      this.messages.push(botMsg);
    });
    input.value = '';
  }

  get formControls() { return this.interviewForm.controls; }

  onSubmit() {
    let patientid = this.activatedRoute.snapshot.url[0].path
    let interviewid = this.activatedRoute.snapshot.url[3].path
    let arr = this.formControls.questions.value;
    let answers = {'Answers': []};
    this.questions.forEach(function (element, i) {
        element.answer = arr[i];
        answers.Answers.push({'questionID': element.question.id, 'answer': arr[i]})
    });
    console.log(answers)
    this.service.answerInterview(patientid, interviewid, answers)
    .subscribe( answeredInterview => {
      console.log('answered');
      this.router.navigate(['/'])
    });
  }

  private getInterview() {
    this.loading = true;
    let patientid = this.activatedRoute.snapshot.url[0].path
    let interviewid = this.activatedRoute.snapshot.url[3].path
    console.log(patientid, interviewid)
    this.service.getPatientInterview(patientid, interviewid)
      .subscribe(interview => {
        this.interview = interview;
        this.questions = interview.questions;
        this.questions.map((o, i) => {
          const control = new FormControl(); // if first item set to true, else false
          (this.interviewForm.controls.questions as FormArray).push(control);
        });
        this.loading = false;
      });
  }
}
