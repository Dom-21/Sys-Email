import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthConfig, DateTimeProvider, OAuthLogger, OAuthService, OAuthStorage, UrlHelperService,  } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com', // Replace with your OAuth provider
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,

  responseType: 'code',

  clientId: '710593147792-uhlk00gu8443p423ais9v71ibjs2369j.apps.googleusercontent.com',

  // set the scope for the permissions the client should request
  scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly',

  showDebugInformation: true,

};

const customDateTimeProvider: DateTimeProvider = {
  now: () => Date.now(), // Return the current timestamp (milliseconds)
  new: () => new Date()  // Return a new Date instance representing the current date/time
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    
    provideRouter(routes),
    
    { provide: OAuthService, useClass: OAuthService },
    { provide: OAuthStorage, useValue: localStorage }, // Store tokens in localStorage
    { provide: AuthConfig, useValue: authConfig },
    { provide: OAuthLogger, useValue: console },
    { provide: DateTimeProvider, useValue: customDateTimeProvider },
    UrlHelperService,

    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }), provideAnimationsAsync(),
  ],
};
