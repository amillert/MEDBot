import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { User } from '../_models/user';
import { Consts } from 'src/common/consts';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public user = new User();


    constructor(private http: Http) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post(Consts.API_ENDPOINT + `/authenticate`, { email, password })
            .pipe(map((response: any) => {
                let responseParsed = JSON.parse(response['_body']);
                let user = {
                    userID: responseParsed.userID,
                    email: email,
                    token: responseParsed.token,
                    roleID: responseParsed.roleID
                }
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(response);
                }
                else if(user && responseParsed.passwordchange) {
                    user['passwordChange'] = responseParsed.passwordchange;
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    changepassword(email: string, oldpassword: string, newpassword: string) {
        return this.http.put(Consts.API_ENDPOINT + `/changepassword`, { email, oldpassword, newpassword }).pipe(
            map(response => response.json())
          );
    }

}
