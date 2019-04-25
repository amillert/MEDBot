import { Injectable } from '@angular/core';
import { Consts } from 'src/common/consts';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

export class Message {
  constructor(public msg: String, public who: String) {}
}

@Injectable({
  providedIn: 'root'
})
export class PatientInterviewService extends DataService {
  conversation = new BehaviorSubject<Message[]>([]);

  constructor(http: Http) {
    super('/', http);
  }

  update_conv(msg: Message) {
    this.conversation.next([msg]);
  }
  
  converse(msg: String) {
    const usrMessage = new Message(msg, 'user');
    this.update_conv(usrMessage);

    return this.http.post(Consts.API_ENDPOINT, msg)
    .pipe(
      map(botResp => this.update_conv(new Message(botResp["fulfillment"]["messages"]["speech"], 'medbot'))
      )
    );
  }

  getPatientInterview(patientID, InterviewID) {
    let uri = Consts.API_ENDPOINT + '/patients/' + patientID + '/interviews/' + InterviewID
    return this.http.get(uri)
    .pipe(
      map(response => response.json()),catchError(this.handleError)
      );
  }

  answerInterview(patientID, InterviewID, answers){
    let uri = Consts.API_ENDPOINT + '/patients/' + patientID + '/interviews/' + InterviewID
    return this.http.put(uri, answers)
    .pipe(
      map(response => response.json()),catchError(this.handleError)
      );
  }

  getBotMessage() {
    let uri = Consts.API_ENDPOINT + '/botmessage';
    console.log(this.http.get(uri, "fds"));
  }

}
