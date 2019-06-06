import { Injectable } from '@angular/core';
import { Consts } from 'src/common/consts';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Message } from 'src/app/services/patient-interview.service';

@Injectable({
  providedIn: 'root'
})
export class InterviewService extends DataService {

  constructor(http: Http, authService: AuthService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      super('/doctors/' + currentUser.userID + '/interviews', http);
    } else {
      super('/doctors/' + location.pathname.split('/')[0] + '/interviews', http);
    }
  }

  addInterview(interview: { PatientID: number, questions: number[] }) {
    return this.http.post(this.uri, JSON.stringify(interview))
      .pipe(
        map(response => response.json())
      );
  }

  updateStatus(interview_id) {
    return this.http.put(this.uri + '/' + interview_id, JSON.stringify({ status: 'Checked' }))
      .pipe(
        map(response => response.json())
      );
  }

  saveConversation(messages: Message[], patientID, interviewID) {
    let uri = Consts.API_ENDPOINT + '/' + interviewID + '/chatbot/' + patientID
    return this.http.post(uri, messages)
      .pipe(
        map(response => response.json())
      );
  }

  getChatbotConversation(interviewID: number) {
    return this.http.get(`${Consts.API_ENDPOINT}/chatbot/${interviewID}`)
      .pipe(
        map(response => response.json())
      );
  }

}
