import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';

const getRedirectUri = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:4201/'; // Works for both localhost:4200 and localhost:4201
  }
  return 'https://sys-email.web.app/'; // Production URL
};

export const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: 'https://sys-email.web.app/', 
  clientId: '710593147792-uhlk00gu8443p423ais9v71ibjs2369j.apps.googleusercontent.com',
  scope:
    'openid profile email https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  showDebugInformation: true,
};

export interface UserInfo {
  info: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  gmail = 'https://gmail.googleapis.com';

  userProfileSubject = new Subject<UserInfo>();

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly httpClient: HttpClient
  ) {
    // confiure oauth2 service
    oAuthService.configure(authCodeFlowConfig);
    // manually configure a logout url, because googles discovery document does not provide it
    oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';

    // loading the discovery document from google, which contains all relevant URL for
    // the OAuth flow, e.g. login url
    oAuthService.loadDiscoveryDocument().then(() => {
      // // This method just tries to parse the token(s) within the url when
      // // the auth-server redirects the user back to the web-app
      // // It doesn't send the user the the login page
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as UserInfo);
          });
        }
        // when not logged in, redirecvt to google for login
        // else load user profile
      });
    });
  }

  signIn() {
    this.oAuthService.tryLoginImplicitFlow().then(() => {
      if (!this.oAuthService.hasValidAccessToken()) {
        this.oAuthService.initLoginFlow();
      } else {
        this.oAuthService.loadUserProfile().then((userProfile) => {
          this.userProfileSubject.next(userProfile as UserInfo);
        });
      }
      // when not logged in, redirecvt to google for login
      // else load user profile
    });
  }

  emails(userId: string): Observable<any> {
    return this.httpClient.get(
      `${this.gmail}/gmail/v1/users/${userId}/messages`,
      { headers: this.authHeader() }
    );
  }

  getMail(userId: string, mailId: string): Observable<any> {
    return this.httpClient.get(
      `${this.gmail}/gmail/v1/users/${userId}/messages/${mailId}`,
      { headers: this.authHeader() }
    );
  }

  getEmailId() {
    const userInfo = this.oAuthService.getIdentityClaims();
    const userEmail = userInfo?.['email'] || "dummymail@gmail.com";
    return userEmail;
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  signOut() {
    this.oAuthService.logOut();
  }

  private authHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.oAuthService.getAccessToken()}`,

    });
  }

  sendEmail(userId: string, rawEmail: string): Observable<any> {

    const url = `${this.gmail}/gmail/v1/users/${userId}/messages/send`;

    return this.httpClient.post(
      url,
      { raw: rawEmail },
      { headers: this.authHeader() }
    );
  }


  forwardMail(userId: string, forwardedEmail: string) {
    return this.httpClient.post(
      `https://www.googleapis.com/gmail/v1/users/${userId}/messages/send`,
      { raw: forwardedEmail },
      { headers: this.authHeader() }
    );
  }


  sendReplyEmail(userId: string, rawEmail: string, threadId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/send`;

    const emailPayload = {
      raw: rawEmail,
      threadId: threadId
    };

    return this.httpClient.post(url, emailPayload, { headers: this.authHeader() });
  }

  trashEmail(userId: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

    return this.httpClient.post(
      url,
      { addLabelIds: ['TRASH'], removeLabelIds: ['INBOX'] },
      { headers: this.authHeader() }
    );
  }

  saveDraft(userId: string, email: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/drafts`;

    const body = {
      message: {
        raw: email
      }
    };

    return this.httpClient.post(url, body, { headers: this.authHeader() });
  }

  starEmail(userId: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

    return this.httpClient.post(
      url,
      { addLabelIds: ['STARRED'] },
      { headers: this.authHeader() }
    );
  }

  unstarEmail(userId: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

    return this.httpClient.post(
      url,
      { removeLabelIds: ['STARRED'] },
      { headers: this.authHeader() }
    );
  }
  markImportant(userId: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

    return this.httpClient.post(
      url,
      { addLabelIds: ['IMPORTANT'] },
      { headers: this.authHeader() }
    );
  }


  unmarkImportant(userId: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

    return this.httpClient.post(
      url,
      { removeLabelIds: ['IMPORTANT'] },
      { headers: this.authHeader() }
    );
  }


  markAsRead(userId: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

    return this.httpClient.post(
      url,
      { removeLabelIds: ['UNREAD'] },
      { headers: this.authHeader() }
    );
  }

  markAsUnread(userId: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

    return this.httpClient.post(
      url,
      { addLabelIds: ['UNREAD'] },
      { headers: this.authHeader() }
    );
  }

  archiveEmail(userId: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

    return this.httpClient.post(
      url,
      { removeLabelIds: ['INBOX'] },  
      { headers: this.authHeader() }
    );
  }


  markAsSpam(userId: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`;

    return this.httpClient.post(
      url,
      { addLabelIds: ['SPAM'] },  
      { headers: this.authHeader() }
    );
  }


  
  
  createDraft(userId: string, email: any): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/drafts`;
    return this.httpClient.post(url, email, { headers: this.authHeader() });
  }
  
  updateDraft(userId: string, draftId: string, email: any): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/drafts/${draftId}`;
    return this.httpClient.put(url, email, { headers: this.authHeader() });
  }
  
  
  
  getDraft(userId: string, draftId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/drafts/${draftId}`;
    return this.httpClient.get(url, { headers: this.authHeader() });
  }
  

  sendDraft(userId: string, raw: string, messageId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/send`;
    const body = { raw, threadId: messageId };  // Use `messageId` as `threadId`
    return this.httpClient.post(url, body, { headers: this.authHeader() });
  }
  
  
  
  



}
