import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig, OAuthEvent } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  clientId: '710593147792-uhlk00gu8443p423ais9v71ibjs2369j.apps.googleusercontent.com',
  redirectUri: 'http://localhost:4200',
  scope:
    'openid profile email https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  showDebugInformation: true,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userProfileSubject = new BehaviorSubject<any>(null);
  private isInitialLoad = true;

  constructor(private oauthService: OAuthService, private router: Router) {
    this.oauthService.configure(authConfig);
    this.oauthService.logoutUrl = 'https://www.google.com/accounts/Logout';
    this.oauthService.loadDiscoveryDocument().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.loadUserProfile();
      } else {
        this.oauthService.tryLogin().then(() => {
          if (this.oauthService.hasValidAccessToken()) {
            alert('Login Successful..');
            this.loadUserProfile();
          } else {
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
    this.oauthService.events
      .pipe(filter((e: OAuthEvent) => e.type === 'token_expires' || e.type === 'token_error'))
      .subscribe((event: OAuthEvent) => {
        console.warn('Token is expiring or there was a token error', event);
        this.attemptSilentLogin();
      });
  }

  private loadUserProfile() {
    this.oauthService.loadUserProfile().then((profile) => {
      this.userProfileSubject.next(profile);
    }).catch((error) => {
      console.error('Failed to load user profile', error);
    });
  }

  private attemptSilentLogin(): void {
    this.oauthService.silentRefresh()
      .then(() => {
        console.log('Silent refresh succeeded.');
        this.loadUserProfile();
      })
      .catch((error) => {
        console.error('Silent refresh failed. Redirecting to login.', error);
        this.router.navigate(['/login']);
      });
  }

  signIn(): void {
    if (!this.oauthService.hasValidAccessToken()) {
      const redirectUrl = this.router.url;
      this.oauthService.initLoginFlow();
      this.oauthService.events.subscribe((event) => {
        if (event.type === 'token_received') {
          this.router.navigate([redirectUrl]);
        }
      });
    }
  }

  signOut(): void {
    this.oauthService.logOut();
    this.router.navigate(['/login']);
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  getUserProfile() {
    return this.userProfileSubject.asObservable();
  }

  getIdentityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
