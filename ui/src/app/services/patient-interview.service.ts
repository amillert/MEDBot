import { Injectable } from '@angular/core';
import { Consts } from 'src/common/consts';
import { Http, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { DataService } from './data.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

export class Message {
  constructor(public msg: String, public who: String) { }
}

@Injectable({
  providedIn: 'root'
})
export class PatientInterviewService extends DataService {
  conversation = new BehaviorSubject<Message[]>([]);
  url = "https://api.dialogflow.com/v1/query?v=12345678";
  token = "929efffd78ba46e8acc8c3fe95055731";
  constructor(http: Http) {
    super('/', http);
  }

  update_conv(msg: Message) {
    this.conversation.next([msg]);
  }

  converse(usrMsg: Message) {
    let data = {
      lang: "eng",
      sessionId: "12345678",
      query: usrMsg.msg
    }
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${this.token}`);
    return this.http.post(`${this.url}`, data, { headers: headers }).pipe(
      map(res => {
        return res.json()["result"]["speech"]
      }));
  }

  getPatientInterview(patientID, InterviewID) {
    let uri = Consts.API_ENDPOINT + '/patients/' + patientID + '/interviews/' + InterviewID
    return this.http.get(uri)
      .pipe(
        map(response => response.json())
      );
  }

  answerInterview(patientID, InterviewID, answers) {
    let uri = Consts.API_ENDPOINT + '/patients/' + patientID + '/interviews/' + InterviewID
    return this.http.put(uri, answers)
      .pipe(
        map(response => response.json())
      );
  }

  getBotMessage() {
    let uri = Consts.API_ENDPOINT + '/botmessage';
  }

}
