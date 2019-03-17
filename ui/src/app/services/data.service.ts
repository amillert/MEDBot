import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { NotFoundError } from 'src/common/not-found-error';
import { BadInput } from 'src/common/bad-input';
import { AppError } from 'src/common/app-error';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  url: string = 'http://127.0.0.1:5000';
  uri: string = '';
  constructor(private urn: string, private http: Http) { 
    this.uri = this.url + urn;
  }
  
  getAll() {
    return this.http.get(this.uri)
    .pipe(
      map(response => response.json()),catchError(this.handleError)
      );
  }

  create(resource) {
    return this.http.post(this.uri, JSON.stringify(resource))
    .pipe(
      map(response => response.json())
      ,catchError(this.handleError)
      );
  }

  update(resource) {
    return this.http.patch(this.uri + '/' + resource.id, JSON.stringify({ isRead: true }))
    .pipe(
      map(response => response.json()),catchError(this.handleError)
      );
  }

  delete(id) {
    return this.http.delete(this.uri + '/' + id)
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
