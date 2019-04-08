import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../data.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientsService extends DataService {

  constructor(http: Http) {
    super('/patients', http);
  }

  addPatient(patient: { email: string, firstName: string, lastName: string }) {
    return this.http.post(this.uri, JSON.stringify(patient))
      .pipe(
        map(response => response.json())
      );
  }
}
