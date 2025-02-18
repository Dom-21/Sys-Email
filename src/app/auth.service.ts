import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false, // Disable strict validation
  clientId: '710593147792-uhlk00gu8443p423ais9v71ibjs2369j.apps.googleusercontent.com',
  redirectUri: 'https://sys-email.web.app',
  scope:
    'openid profile email https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  showDebugInformation: true,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userProfileSubject = new BehaviorSubject<any>(null);
  private isInitialLoad = true; // Flag to control the flow during initial load

  constructor(private oauthService: OAuthService, private router: Router) {
    // Configure OAuth2
    this.oauthService.configure(authConfig);
    this.oauthService.logoutUrl = 'https://www.google.com/accounts/Logout';

    // Load discovery document and handle login
    this.oauthService.loadDiscoveryDocument().then(() => {
      // Only try to login if it's the initial load and the URL contains tokens
      if (this.oauthService.hasValidAccessToken()) {
        // User already authenticated
        this.loadUserProfile();
      } else {
        this.oauthService.tryLogin().then(() => {
          if (this.oauthService.hasValidAccessToken()) {
            // Login was successful
            this.loadUserProfile();
          } else {
            // User is not authenticated, stay on the login page or redirect elsewhere
            this.router.navigate(['/login']);
          }
        }).catch((error) => {
          console.error('OAuth2 login failed', error);
          this.router.navigate(['/login']);
        });
      }
    }).catch((error) => {
      console.error('OAuth2 discovery document load failed', error);
    });
  }

  private loadUserProfile() {
    this.oauthService.loadUserProfile().then((profile) => {
      this.userProfileSubject.next(profile);
    }).catch((error) => {
      console.error('Failed to load user profile', error);
    });
  }

  // Sign in and initiate OAuth2 flow
  signIn(): void {
    // Prevent triggering login if the user is already authenticated
    if (!this.oauthService.hasValidAccessToken()) {
      const redirectUrl = this.router.url; // Save the current URL before login
      this.oauthService.initLoginFlow();

      // After login, navigate to the saved URL
      this.oauthService.events.subscribe((event) => {
        if (event.type === 'token_received') {
          this.router.navigate([redirectUrl]);
        }
      });
    }
  }

  // Sign out and redirect to login page
  signOut(): void {
    this.oauthService.logOut();
    this.router.navigate(['/login']);
  }

  // Get the access token
  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  // Get user profile observable
  getUserProfile() {
    return this.userProfileSubject.asObservable();
  }

  // Get identity claims
  getIdentityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
