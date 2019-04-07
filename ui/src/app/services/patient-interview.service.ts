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
export class PatientInterviewService extends DataService {

  constructor(http: Http) {
    super('/', http);
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

}
