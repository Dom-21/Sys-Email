import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { GoogleApiService } from '../shared/google-api.service';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  emailIsInvalid: boolean = false;
  passwordIsInvalid: boolean = false;
  emails: any = [];

  constructor(
    private authService: AuthService,
    private googleApi: GoogleApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if already authenticated (after OAuth2 redirect)
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      // Initiate login flow if not authenticated
      this.authService.signIn();
    }
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
    } else {
      this.emailIsInvalid = !this.email?.valid;
      this.passwordIsInvalid = !this.password?.valid;
    }
  }

  signOut() {
    this.authService.signOut();
  }

  login() {
    this.authService.signIn();

    // Wait for the user to be authenticated before redirecting
    this.authService.getUserProfile().subscribe(profile => {
      if (profile) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private fetch() {
    // Fetch user-related data if necessary
    // this.googleApi.setEmailSubscription = emailSubscription;
  }
}
