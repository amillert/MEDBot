import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { BadInput } from 'src/common/bad-input';
import { NotFoundError } from 'src/common/not-found-error';
import { AppError } from 'src/common/app-error';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService extends DataService {

  constructor(http: Http) {
    super('/doctors', http);
   }

   addDoctor(doctor: { email: string, password: string, firstName: string, lastName:string }) {
  //   let newDoctor = {
  //     id: 1,
  //     email: doctor.email,
  //     firstName: doctor.firstName,
  //     lastName: doctor.lastName
  // };

  // return Observable.create(observer => {
  //     observer.next(newDoctor);
  //   });
    return this.http.post(this.uri, JSON.stringify(doctor))
    .pipe(
      map(response => response.json())
      ,catchError(this.handleError)
      );
  }

}
