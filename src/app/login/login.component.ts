import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { GoogleApiService } from '../shared/google-api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  emailIsInvalid: boolean = false;
  passwordIsInvalid: boolean = false;
  emails:any = [];


  constructor(
    private authService: AuthService,
    private googleApi : GoogleApiService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {

    
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit(): void {

    if (this.form.valid) {
      // Authenticate the user
      const credentials = this.form.value;
      this.authService.login(credentials);
    } else {
      this.emailIsInvalid = !this.email?.valid;
      this.passwordIsInvalid = !this.password?.valid;
    }
  }
  

  signOut() {
    this.googleApi.signOut();
  }

  login() {
    
  }
  
  
  

  

  private fetch() {

    // this.googleApi.setEmailSubscription = emailSubscription;
  }

  
  


}
