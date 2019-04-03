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
  loading = false;
  answers: string[];
  questions: any[];
  interviews: any[];
  interviewForm: FormGroup;

  constructor(private form: FormBuilder, private QService: QuestionsService, private IService: InterviewService) {}

  ngOnInit() {
    this.getAllQuestions();
    this.getAllInterviews();
    this.interviewForm = this.form.group({
    });
  }

  sendMessage(input: HTMLInputElement, idx: number) {
    this.answers.splice(idx, 1, input.value);
    console.log(this.answers);
  }

  private getAllQuestions() {
    this.loading = true;
    this.QService.getAll()
      .subscribe(questions => {
        this.questions = questions['questions'];
        this.answers = Array<string>(this.questions.length).fill('');
        this.loading = false;
        console.log(this.questions);
      });
  }

  private getAllInterviews() {
    this.loading = true;
    this.IService.getAll()
      .subscribe(interviews => {
        this.interviews = interviews['interviews'];
        this.loading = false;
        console.log(this.interviews);
      });
  }
}
