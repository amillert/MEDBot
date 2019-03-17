import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService extends DataService {

  constructor(http: Http) {
    super('/doctors', http);
   }
}
