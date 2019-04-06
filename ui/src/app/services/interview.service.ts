import { Injectable } from '@angular/core';
import { Consts } from 'src/common/consts';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterviewService extends DataService {

  constructor(http: Http, authService: AuthService) {
    super('/doctors/' + JSON.parse(localStorage.getItem('currentUser')).userID + '/interviews', http);
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

  addInterview(interview: { PatientID: number, questions: number[] }) {
    console.log(this.uri)
    return this.http.post(this.uri, JSON.stringify(interview))
      .pipe(
        map(response => response.json())
        , catchError(this.handleError)
      );
  }
}
