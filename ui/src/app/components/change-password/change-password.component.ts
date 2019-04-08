import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changeForm: FormGroup;
  returnUrl: string;
  loading = false;
  email: string;
  oldpassword: string;
  newpassword: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private autthService: AuthService
    ) { }

  ngOnInit() {
    this.changeForm = this.formBuilder.group({
      email: ['', Validators.required],
      oldpassword: ['', Validators.required],
      newpassword: ['', Validators.required],
      vnewpassword: ['', Validators.required]
    });
  }

  get formControls() { return this.changeForm.controls; }

  onSubmit() {
    this.loading = true;
    this.email = this.changeForm.controls.email.value;
    this.oldpassword = this.changeForm.controls.oldpassword.value;
    this.newpassword = this.changeForm.controls.newpassword.value;

    if (this.changeForm.invalid || this.newpassword !== this.changeForm.controls.vnewpassword.value) {
      this.loading = false;
      return; 
    }

    this.autthService.changepassword(this.email, this.oldpassword, this.newpassword).subscribe( changedPassowrd => {
      console.log('changedPassowrd');
      this.router.navigate(['/login'])
    });
  }
}
