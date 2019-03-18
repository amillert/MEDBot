import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Helloworld } from '../models/helloworld';
import { BadInput } from 'src/common/bad-input';
import { NotFoundError } from 'src/common/not-found-error';
import { AppError } from 'src/common/app-error';
import { throwError, Observable } from 'rxjs';
import { Consts } from 'src/common/consts';
@Injectable({
  providedIn: 'root'
})
export class HelloworldService {

  constructor(private http: Http) { }

  getHelloWorld(): Observable<Helloworld> {
    return this.http.get(Consts.API_ENDPOINT)
    .pipe(
      map(response => response.json()),catchError(this.handleError)
      );
  }

  private handleError(error: Response) {
    if (error.status === 400)
      return throwError(new BadInput(error.json()));
  
    if (error.status === 404)
      return throwError(new NotFoundError());
    
    return throwError(new AppError(error));
  }
}
