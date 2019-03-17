import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class MedsService extends DataService {

  constructor(http: Http) {
    super('/meds', http);
   }
}
