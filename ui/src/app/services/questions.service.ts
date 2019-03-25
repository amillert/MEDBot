import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Http } from '@angular/http';
<<<<<<< HEAD
import { map, catchError } from 'rxjs/operators';
=======
>>>>>>> 3af0f7f2ecfae173d740970203466bba6b107f2c

@Injectable({
  providedIn: 'root'
})
export class QuestionsService extends DataService {
<<<<<<< HEAD
  constructor(http: Http) {
    super('/questions', http);
  }

  addQuestion(new_question: { question: string }) {
    return this.http.post(this.uri, JSON.stringify(new_question))
      .pipe(
        map(response => response.json()), 
        catchError(this.handleError)
      );
  }
}
=======

  constructor(http: Http) {
    super('/questions', http);
   }
}
>>>>>>> 3af0f7f2ecfae173d740970203466bba6b107f2c
