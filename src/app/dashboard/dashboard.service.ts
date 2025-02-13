import { EventEmitter, Injectable, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { GoogleApiService } from '../shared/google-api.service';


export interface Email {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  historyId?: string;
  internalDate?: string;
  sizeEstimate?: number;
  raw?: string;
  payload?: {
    partId?: string;
    mimeType?: string;
    filename?: string;
    headers?: { name?: string; value?: string }[];
    body?: { attachmentId?: string; size?: number; data?: string };
    parts?: any[];
  };
}



@Injectable({
  providedIn: 'root'
})



export class DashboardService implements OnInit{
 

  constructor(private router: Router, private googleApi: GoogleApiService){}
  
  private emailsSubject = new BehaviorSubject<Email[]>([]);
  emails$ = this.emailsSubject.asObservable(); 

  private emails: Email[] = []; 


  ngOnInit(): void {
      
  }

  
  

  storeEmail(email: Email) {
    this.emails.push(email);
    this.emailsSubject.next([...this.emails]); 
  }

  storeEmails(emailList: Email[]) {
    this.emails = emailList;
    this.emailsSubject.next([...this.emails]); 
  }

  getAllEmails(): Email[] {
    return this.emails;
  }

  reloadCurrentRoute(): void {
  
    const currentUrl = this.router.url;
    
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  async fetchAndStoreEmails(): Promise<void> {
    if (!this.googleApi.isLoggedIn()) {
      return;
    }

    try {
      const userId = 'me';
      const messages = await lastValueFrom(this.googleApi.emails(userId));

      for (const element of messages.messages) {
        const mail = await lastValueFrom(this.googleApi.getMail(userId, element.id));
        this.storeEmail(mail);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  }

}
