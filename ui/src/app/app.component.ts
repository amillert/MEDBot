import { Component } from '@angular/core';
import { User } from './_models/user';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MED Bot';

  currentUser: User;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    this.sharedService.changeEmitted$.subscribe(
      user => {
        this.currentUser = user;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  //test method
  logUser() {
    console.log('logUser from app.component')
    console.log(this.currentUser)
  }
}
