import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService extends DataService {
  constructor(http: Http) {
    super('/questions', http);
  }

  addQuestion(new_question: { question: string }) {
    console.log(JSON.stringify(new_question))
    return this.http.post(this.uri, JSON.stringify(new_question))
      .pipe(
        map(response => response.json())
      );
  }
}
