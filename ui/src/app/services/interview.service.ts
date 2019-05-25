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
    super('/doctors/' + JSON.parse(localStorage.getItem('currentUser')).userID + '/interviews', http);
  }

  addInterview(interview: { PatientID: number, questions: number[] }) {
    console.log(this.uri)
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

}
