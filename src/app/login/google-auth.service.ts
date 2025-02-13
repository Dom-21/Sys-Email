import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn() {
    (window as any).google.accounts.id.initialize({
      client_id: '710593147792-uhlk00gu8443p423ais9v71ibjs2369j.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });
  }

  handleCredentialResponse(response: any) {
    const idToken = response.credential;
    console.log('Google ID Token:', { id: idToken});

    // Save the token in localStorage
    localStorage.setItem('google_id_token', idToken);

    // Update the user subject to notify subscribers
    this.userSubject.next(idToken);

    // Fetch emails after successful sign-in
    this.fetchEmails(idToken);
  }

  renderSignInButton() {
    (window as any).google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large' }
    );
  }

  getStoredToken() {
    return localStorage.getItem('google_id_token');
  }

  clearToken() {
    localStorage.removeItem('google_id_token');
    this.userSubject.next(null);
  }

  // Fetch emails from Gmail using the stored ID token
  fetchEmails(idToken: string) {
    const accessToken = this.getAccessToken(idToken);
    if (accessToken) {
      this.makeGmailApiCall(accessToken);
    } else {
      console.error('Access token not found.');
    }
  }

  // Get the access token from Google API
  getAccessToken(idToken: string) {
    // Get the access token from the ID token response if needed
    // Use the ID token to authenticate and obtain an access token via the Google API (OAuth 2.0)
    return localStorage.getItem('google_access_token'); // You would store the access token here if needed
  }

  // Call Gmail API to fetch emails
  makeGmailApiCall(accessToken: string) {
    fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched emails:', data);
    })
    .catch((error) => {
      console.error('Error fetching emails:', error);
    });
  }

  

  // Call Gmail API to fetch email
}
