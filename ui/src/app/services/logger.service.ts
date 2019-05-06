import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Consts } from 'src/common/consts';
import { DataService } from './data.service';
import { map } from 'rxjs/operators';
import { Log } from '../models/log';

@Injectable({
  providedIn: 'root'
})
export class LoggerService extends DataService {

  constructor(http: Http) {
    super('/', http);
  }

  getLogs() {
    let uri = Consts.API_ENDPOINT + '/logs'
    return this.http.get(uri)
      .pipe(
        map(response => response.json())
      );
  }

  clear() {
    let uri = Consts.API_ENDPOINT + '/logs'
    return this.http.delete(uri)
    .pipe(
      map(response => response.json())
    );
  }

  logError(message) {
    let log: Log = {
      status: 'ERROR',
      message: message,
      datetime: new Date()
    }
    console.log("logError")
    console.log(log)
    let uri = Consts.API_ENDPOINT + '/logs'
    return this.http.post(uri, JSON.stringify(log))
      .pipe(
        map(response => response.json())
      );
  }

  logWarn(message) {
    let log: Log = {
      status: 'WARN',
      message: message,
      datetime: new Date()
    }
    let uri = Consts.API_ENDPOINT + '/logs'
    return this.http.post(uri, JSON.stringify(log))
      .pipe(
        map(response => response.json())
      );
  }

  logInfo(message) {
    let log: Log = {
      status: 'INFO',
      message: message,
      datetime: new Date()
    }
    let uri = Consts.API_ENDPOINT + '/logs'
    return this.http.post(uri, JSON.stringify(log))
      .pipe(
        map(response => response.json())
      );
  }
}
