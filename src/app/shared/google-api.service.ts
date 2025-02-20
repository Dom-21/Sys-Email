import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { from, map, mergeMap, Observable, Subject, toArray } from 'rxjs';
import { AuthService } from '../auth.service';

const getRedirectUri = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:4200'; // Works for both localhost:4200 and localhost:4201
  }
  return 'https://sys-email.web.app'; // Production URL
};

export const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: 'http://localhost:4200',
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
  private API_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages?q=in:inbox';
  private gmailApiUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/'
  userProfileSubject = new Subject<UserInfo>();

  // constructor(
  //   private readonly oAuthService: OAuthService,
  //   private readonly httpClient: HttpClient
  // ) {
  //   // confiure oauth2 service
  //   oAuthService.configure(authCodeFlowConfig);
  //   // manually configure a logout url, because googles discovery document does not provide it
  //   oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';

  //   // loading the discovery document from google, which contains all relevant URL for
  //   // the OAuth flow, e.g. login url
  //   oAuthService.loadDiscoveryDocument().then(() => {
  //     // // This method just tries to parse the token(s) within the url when
  //     // // the auth-server redirects the user back to the web-app
  //     // // It doesn't send the user the the login page
  //     this.oAuthService.tryLoginImplicitFlow().then(() => {
  //       if (!this.oAuthService.hasValidAccessToken()) {
  //         this.oAuthService.initLoginFlow();
  //       } else {
  //         this.oAuthService.loadUserProfile().then((userProfile) => {
  //           this.userProfileSubject.next(userProfile as UserInfo);
  //         });
  //       }
  //       // when not logged in, redirecvt to google for login
  //       // else load user profile
  //     });
  //   });
  // }

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  // Helper function to get the authorization header
  private authHeader(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Fetch user profile
  getUserProfile(): Observable<any> {
    return this.httpClient
      .get(`${this.gmailApiUrl}profile`, { headers: this.authHeader() })
      .pipe(map((profile) => profile));
  }



  getEmailId() {
    const userInfo = this.authService.getIdentityClaims();
    const userEmail = userInfo?.['email'] || "dummymail@gmail.com";
    return userEmail;
  }

  //========================================================================================================================
  getAllEmailIds(url: string): Observable<string[]> {
    return this.httpClient.get<any>(url, { headers: this.authHeader() }).pipe(
      map(response => response.messages?.map((msg: any) => msg.id))
    );
  }

  // get full email details..
  getEmailDetails(emailId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`;
    return this.httpClient.get<any>(url, { headers: this.authHeader() });
  }

  // fetching all emails..
  // getAllEmails(url: string): Observable<any[]> {
  //   return this.getAllEmailIds(url).pipe(
  //     mergeMap((ids) => ids?.map(id => this.getEmailDetails(id))), 
  //     mergeMap(obsArray => obsArray),  
  //     toArray()  
  //   );
  // }
  getAllEmails(url: string): Observable<any[]> {
    return this.getAllEmailIds(url).pipe(
      mergeMap((ids) => {
        // Ensure that ids is an array; if not, return an empty array
        const emailIds: any[] = Array.isArray(ids) ? ids : [];
        return from(emailIds);
      }),
      mergeMap(id => this.getEmailDetails(id)),
      toArray()
    );
  }
  
  //===========================================================================================================================

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

  getDraft(userId: string, draftId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/drafts/${draftId}`;
    return this.httpClient.get(url, { headers: this.authHeader() });
  }


  // sendDraft(userId: string, raw: string, messageId: string): Observable<any> {
  //   const url = `https://www.googleapis.com/gmail/v1/users/${userId}/messages/send`;
  //   const body = { raw, threadId: messageId };  // Use `messageId` as `threadId`
  //   return this.httpClient.post(url, body, { headers: this.authHeader() });
  // }



  encodeBase64(text: string): string {
    return btoa(unescape(encodeURIComponent(text)));
  }




  getDrafts(): Observable<any[]> {
    const url = `https://www.googleapis.com/gmail/v1/users/me/drafts`;
    const headers = this.authHeader();
    let draftMessages: any[] = [];

    return new Observable(observer => {
      this.httpClient.get<any>(url, { headers }).subscribe(response => {
        if (response.drafts && response.drafts.length > 0) {
          let pendingRequests = response.drafts.length;

          response.drafts.forEach((draft: any) => {
            this.getDraftMessage(draft.id).subscribe((message: any) => {
              draftMessages.push({ draftId: draft.id, ...message });
              pendingRequests--;

              if (pendingRequests === 0) {
                observer.next(draftMessages);
                observer.complete();
              }
            });
          });
        } else {
          observer.next([]);
          observer.complete();
        }
      }, error => {
        observer.error(error);
      });
    });
  }

  getDraftMessage(draftId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/me/drafts/${draftId}`;
    const headers = this.authHeader();

    return this.httpClient.get<any>(url, { headers }).pipe(
      map(response => ({ draftId, ...response.message })) // Add draftId in response
    );
  }

  updateDraft(userId: string, draftId: string, raw: any): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/drafts/${draftId}`;
    const headers = this.authHeader();
    // console.log(raw);
    
    const body = {
      message: {
        raw: raw
      }
    };
  
    return this.httpClient.put<any>(url, body, { headers });
  }

  sendDraft(userId: string, draftId: string): Observable<any> {
    const url = `https://www.googleapis.com/gmail/v1/users/${userId}/drafts/send`;
    const headers = this.authHeader();
  
    const body = { id: draftId };
  
    return this.httpClient.post<any>(url, body, { headers });
  }
  

  getAttachmentData(messageId: string, attachmentId: string): Observable<string> {
    const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`;
    const headers = this.authHeader();
    return this.httpClient.get<any>(url, { headers }).pipe(
      map(response => {
        
        return response.data;
      })
    );
  }


}
