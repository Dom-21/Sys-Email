import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const oAuthService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is logged in
  if (oAuthService.isAuthenticated()) {
    return true;  // User is logged in, allow access to the route
  } else {
    // If not logged in, check if the user is already on the login page
    if (state.url !== '/login') {
      console.log('No valid access token, redirecting to login...');
      router.navigateByUrl('/login')
      
    }
    return false;
     // Prevent access to the route
  }
};
