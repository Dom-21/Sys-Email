import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const oAuthservice = inject(OAuthService);
  const router = inject(Router);

  if (!oAuthservice.hasValidAccessToken()) {
    oAuthservice.initLoginFlow(); // Redirect to login if no token
    return throwError(() => new Error('No valid access token'));
  }

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${oAuthservice.getAccessToken()}`
    }
  });

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        oAuthservice.initLoginFlow(); // If token expired, force login
      }
      return throwError(() => error);
    })
  );
};
