import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Consts } from 'src/common/consts';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  url: string = Consts.API_ENDPOINT;
  uri: string = '';
  constructor(private urn: string, protected http: Http) {
    this.uri = this.url + urn;
  }

  getAll() {
    return this.http.get(this.uri)
      .pipe(
        map(response => response.json())
      );
  }

  get(id) {
    return this.http.get(this.uri + '/' + id)
      .pipe(
        map(response => response.json())
      );
  }

  create(resource) {
    return this.http.post(this.uri, JSON.stringify(resource))
      .pipe(
        map(response => response.json())
      );
  }

  update(resource) {
    return this.http.patch(this.uri + '/' + resource.id, JSON.stringify({ isRead: true }))
      .pipe(
        map(response => response.json())
      );
  }

  delete(id) {
    console.log(id)
    return this.http.delete(this.uri + '/' + id)
      .pipe(
        map(response => response.json())
      );
  }
}
