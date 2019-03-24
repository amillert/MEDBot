import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AppError } from 'src/common/app-error';
import { BadInput } from 'src/common/bad-input';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {
  messages: any[];

  constructor(private service: InterviewService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.route.params.pipe(switchMap(params => 
    //   this.service.getTest(params['id'])))
    // .subscribe(messages => {this.messages = messages; console.log(messages)});


    // messages example, backend has not been implemented
    this.messages = [{
      id: 0,
      patientId: 1,
      who: 'MEDBot',
      text: 'Hi, Patient! How are You today?'
    }];
  }

  sendMessage(input: HTMLInputElement) {
    let previous_idx = this.messages[this.messages.length - 1].id;
    let message = { id: previous_idx + 1, patientId: 1, who: 'Patient', text: input.value };
    this.messages.push(message);

    input.value = '';
    console.log(this.messages);

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
}
