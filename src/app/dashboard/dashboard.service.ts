import { EventEmitter, Injectable, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';


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
 

  constructor(private router: Router){}
  
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
}
