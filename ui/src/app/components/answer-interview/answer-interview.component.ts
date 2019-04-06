import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { InterviewService } from 'src/app/services/interview.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-answer-interview',
  templateUrl: './answer-interview.component.html',
  styleUrls: ['./answer-interview.component.css']
})
export class AnswerInterviewComponent implements OnInit {
  interview: any[];
  questions: any[];
  interviewForm: FormGroup;
  loading = true;
  constructor(private router: Router, private fb: FormBuilder, private activatedRoute: ActivatedRoute, private service: InterviewService ) { }

  ngOnInit() {
    this.interviewForm = this.fb.group({
      questions: new FormArray([])
    });
    this.getInterview();
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
