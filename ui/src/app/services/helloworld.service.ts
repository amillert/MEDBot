import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Helloworld } from '../models/helloworld';
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
        map(response => response.json())
      );
  }
}
