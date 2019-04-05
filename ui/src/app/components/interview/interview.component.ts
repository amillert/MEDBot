import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { InterviewService } from 'src/app/services/interview.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { AppError } from 'src/common/app-error';
import { BadInput } from 'src/common/bad-input';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {
  loading = true;
  questions: any[];
  interview: any[];
  interviewForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private form: FormBuilder, private QService: QuestionsService, private IService: InterviewService) {}

  ngOnInit() {
    this.getInterview(this.activatedRoute.snapshot.url[1].path);
  }

  // sendMessage(input: HTMLInputElement, idx: number) {
  //   this.answers.splice(idx, 1, input.value);
  //   console.log(this.answers);
  // }

  private getInterview(id) {
    this.loading = true;
    this.IService.get(id)
      .subscribe(interview => {
        this.interview = interview;
        this.questions = interview.questions;
        this.loading = false;
        console.log(this.interview, this.questions);
      });

  }
}
