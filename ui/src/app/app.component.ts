import { Component } from '@angular/core';
import { User } from './_models/user';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';
import { interval } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MEDBot';
  logoImage = "../favicon.ico"
  changeImage = false;
  currentUser: User;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private toastrService: ToastrService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    this.sharedService.changeEmitted$.subscribe(
      user => {
        this.currentUser = user;
      });
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  mouseOverLogo() {
    this.changeImage = true;
    (async () => {
      var i = 0;
      while (this.changeImage) {
        await this.delay(200);
        if (i == 0) {
          this.logoImage = "../assets/images/favicon2.ico";
          i = 1;
        } else {
          this.logoImage = "../favicon.ico";
          i = 0;
        }
      }
    })();
  }

  mouseLeaveLogo() {
    this.changeImage = false;
    this.logoImage = "../favicon.ico"
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toastrService.success("You are logged out !")
  }
}
