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
  interviewForm: FormGroup;

  constructor(private form: FormBuilder) { }

  ngOnInit() {
    // preguntas ejemplo
    this.questions = [{
      bot: 'MEDBot',
      text: 'How do You feel today?'
    }, 
    {
      bot: 'MEDBot',
      text: 'How did You sleep tonight?'
    }, 
    {
      bot: 'MEDBot',
      text: 'Did You take Your pills?'
    }]

    this.interviewForm = this.form.group({

    });

    // this.route.params.pipe(switchMap(params => 
    //   this.service.getTest(params['id'])))
    // .subscribe(messages => {this.messages = messages; console.log(messages)});

      // messages example, backend has not been implemented
      // this.messages = [{
      //   id: 1,
      //   patientId: 1,
      //   who: 'MEDBot',
      //   text: 'Hi !'
      // },
      // {
      //   id: 2,
      //   patientId: 1,
      //   who: 'Patient',
      //   text: 'Hello !'
      // }];
  }

  sendMessage(input: HTMLInputElement) {
    this.answers.push(input.value);
    // this.answers.splice(this.answers.length,0, input.value);
    console.log(this.answers);
    console.log();
    console.log();
    console.log();
    // this.service.create(message)
    //   .subscribe(
    //     newMessage => {
    //       message['id'] = newMessage.id;
    //     },
    //     (error: AppError) => {
    //       this.messages.splice(0, 1);

    //       if (error instanceof BadInput) {
    //         // this.form.setErrors(error.originalError);
    //       }
    //       else throw error;
    //     });
  }

  private getAllQuestions() {
    console.log(this.questions);
    return this.questions;
    // this.loading = true;
    // console.log(this.loading)
    // this.questions_service.getAll()
      // .subscribe(questions => { this.questions = questions['Question']; this.loading = false; console.log(this.loading) });
  }

}
