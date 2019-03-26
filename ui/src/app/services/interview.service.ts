import { Injectable } from '@angular/core';
import { Consts } from 'src/common/consts';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService  extends DataService {

  constructor(http: Http) {
    super('/interview', http);
   }

   addInterview(interview: { PatientID: number, questions: number[] }) {
console.log(JSON.stringify(interview))
      return this.http.post(this.uri, JSON.stringify(interview))
      .pipe(
        map(response => response.json())
        ,catchError(this.handleError)
        );
    }
}
