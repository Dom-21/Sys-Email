import { inject, Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, forkJoin, map, Observable, of, single } from 'rxjs';
import { GoogleApiService } from './google-api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

export interface EmailAttachment {
  filename: string;
  mimeType: string;
  size: number;
  dataId?: string;
}

export interface EmailDetails {
  to: string;
  cc: string;
  from: string;
  subject: string;
  date: string;
  id: string;
  messageId: string;
  threadId: string;
  draftId:string;
  references: string;
  labels: string[];
  isImportant: boolean;
  isStarred: boolean;
  isSent: boolean;
  isReceived: boolean;
  isSpam: boolean;
  isDraft: boolean;
  isTrashed: boolean;
  isUnread: boolean;
  body: string;
  attachments: EmailAttachment[];
  category: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class FetchedMailService {

  currentMails = signal<EmailDetails[]>([]);

  loading = signal<boolean>(true);
  load = signal<string>('inbox');
  component = signal<string>('');
  emails: any;
  allmails: any;
  draftId = signal<string>('');
  inboxLength = signal<number>(0);
  draftsLength = signal<number>(0);
  currentMessage = signal<EmailDetails | null>(null);

  selectedMessages: EmailDetails[] = [];
  extractedEmails!: EmailDetails[];
  private replySubject = new BehaviorSubject<EmailDetails | null>(null);
  private forwardSubject = new BehaviorSubject<EmailDetails | null>(null);


  reply$ = this.replySubject.asObservable();
  forward$ = this.forwardSubject.asObservable();
  /*
  urls = {
    inbox: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=in:inbox',
    sent: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=in:sent',
    starred: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=is:starred',
    spam: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=in:spam',
    draft: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=in:draft',
    trash: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=in:trash',
    archieve: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=-in:inbox -in:sent -in:draft -in:trash -in:spam',
    important: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=is:important',
  }*/

  constructor(private googleApiService: GoogleApiService,
    private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar,
    private location: Location
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  goBack() {
    this.location.back();
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  replyMail(msg: EmailDetails) {
    this.replySubject.next(msg);
  }

  forwardMail(msg: EmailDetails) {
    this.forwardSubject.next(msg);
  }

  async getMails(text: string) {
    try {
      
      this.component.set(text);
      const label = text !== 'archieve' ? (text !== 'starred' ? `in:${text}` : `is:starred`) : '-in:inbox -in:sent -in:draft -in:trash -in:spam';
      if (label === 'in:draft') {
        this.googleApiService.getDrafts().subscribe(drafts => {
          this.currentMails.set(
            this.toEmailsArray(drafts).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          );
          // console.log(this.currentMails());
          
        });
        
        
        return;
      } else {
        const url = `https://www.googleapis.com/gmail/v1/users/me/messages?q=${label}`
        
        this.emails = await firstValueFrom(this.googleApiService.getAllEmails(url));
        
        
        if(this.emails){
          this.currentMails.set(
            this.toEmailsArray(this.emails).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          );
        }
        // console.log(this.currentMails());
      }


      


    } catch (error) {
      console.error('Error fetching emails:', error);
    }
    this.loading.set(false);
  }

  private convertToEmailDetails(message: any): EmailDetails {
    // console.log(message);
    const headers = message.payload.headers;
    const getHeader = (name: string) =>
      headers.find(
        (header: any) => header.name.toLowerCase() === name.toLowerCase()
      )?.value || '';

    return {
      to: getHeader('To'),
      cc: getHeader('Cc'),
      from: getHeader('From'),
      subject: getHeader('Subject'),
      date: getHeader('Date'),
      id: message.id,
      messageId: getHeader('Message-Id'),
      threadId: message.threadId,
      draftId: message.draftId ? message.draftId:'none',
      references: getHeader('References'),
      labels: message.labelIds || [],
      isImportant: message.labelIds?.includes('IMPORTANT') || false,
      isStarred: message.labelIds?.includes('STARRED') || false,
      isSent: message.labelIds?.includes('SENT') || false,
      isReceived:
        !message.labelIds?.includes('DRAFT') &&
        !message.labelIds?.includes('SENT'),
      isSpam: message.labelIds?.includes('SPAM') || false,
      isDraft: message.labelIds?.includes('DRAFT') || false,
      isTrashed: message.labelIds?.includes('TRASH') || false,
      isUnread: message.labelIds?.includes('UNREAD') || false,
      body: message.snippet,
      attachments: this.extractAttachments(message.payload.parts || []),
      category: this.getEmailCategory(message.labelIds),
      color: this.getBackgroundColor(message.labelIds),

    };
  }

  getEmailCategory(labels: string[]): string {
    if (!labels || labels.length === 0) return 'Unknown';

    if (labels.includes('INBOX')) return 'inbox';
    if (labels.includes('SENT')) return 'sent';
    if (labels.includes('DRAFT')) return 'draft';
    return 'Other';
  }

  getBackgroundColor(labels: any) {
    var categoryLabels = labels.filter((label: string) => label.startsWith("CATEGORY_"));
    switch (categoryLabels[0]) {
      case 'CATEGORY_WORK':
        return 'bg-orange-400';
      case 'CATEGORY_PERSONAL':
        return 'bg-blue-400';
      case 'CATEGORY_SOCIAL':
        return 'bg-green-400';
      case 'CATEGORY_PROMOTIONS':
        return 'bg-red-400';
      default:
        return 'bg-gray-800';  // Default color
    }
  }

  private decodeBase64Body(encoded: string): string {
    try {
      return atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (e) {
      return '';
    }
  }


  private extractAttachments(parts: any[]): EmailAttachment[] {
    return parts
      .filter((part) => part.filename)
      .map((part) => ({
        filename: part.filename,
        mimeType: part.mimeType,
        size: part.body?.size || 0,
        dataId: part.body?.attachmentId,
      }));
  }

  searchMessages(searchTerm: string): EmailDetails[] {
    // console.log(this.extractedEmails);
    if (!searchTerm?.trim() || !this.extractedEmails?.length) return this.extractedEmails;

    const lowerCaseTerm = searchTerm.toLowerCase();

    return this.extractedEmails.filter((email: EmailDetails) =>
      email.to?.toLowerCase().includes(lowerCaseTerm) ||
      email.cc?.toLowerCase().includes(lowerCaseTerm) ||
      email.from?.toLowerCase().includes(lowerCaseTerm) ||
      email.subject?.toLowerCase().includes(lowerCaseTerm) ||
      email.body?.toLowerCase().includes(lowerCaseTerm) ||
      email.date?.toLowerCase().includes(lowerCaseTerm) ||
      email.attachments?.some(att => att.filename?.toLowerCase().includes(lowerCaseTerm))
    );
  }






  toEmailsArray(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg))
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          emailMap.set(email.messageId, email);
        }
      });

    this.inboxLength.set(emailMap.size);
    return Array.from(emailMap.values());
  }

  filterExtract(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg))
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          emailMap.set(email.messageId, email);
        }
      });

    return Array.from(emailMap.values());
  }

  reloadCurrentRoute() {
    this.getMails(this.component());
  }

  trashSelectedEmails(): Observable<any[]> {

    const trashedMessageIds = this.selectedMessages.map((email) => email.id);


    const trashRequests = trashedMessageIds.map((messageId) =>

      this.googleApiService.trashEmail('me', messageId).pipe(
        catchError((error) => {
          console.error(`Failed to trash email ${messageId}:`, error);
          return of(null); // Prevent entire request from failing
        })
      )
    );


    return forkJoin(trashRequests).pipe(
      map(() => {
        this.selectedMessages = this.selectedMessages.map((email) => {
          if (trashedMessageIds.includes(email.messageId)) {
            return {
              ...email,
              isTrashed: true,
              labels: [...email.labels.filter((l) => l !== 'INBOX'), 'TRASH']
            };
          }
          return email;
        });

        return this.selectedMessages;
      })
    );
  }

  markSelectedAsRead(): Observable<any[]> {
    const readMessageIds = this.selectedMessages.map((email) => email.id);

    const readRequests = readMessageIds.map((messageId) =>
      this.googleApiService.markAsRead('me', messageId).pipe(
        catchError((error) => {
          console.error(`Failed to mark email ${messageId} as read:`, error);
          return of(null);
        })
      )
    );

    return forkJoin(readRequests).pipe(
      map(() => {
        this.selectedMessages = this.selectedMessages.map((email) => {
          if (readMessageIds.includes(email.id)) {
            return {
              ...email,
              labels: email.labels.filter((l) => l !== 'UNREAD')
            };
          }
          email.isUnread = false;
          return email;
        });

        return this.selectedMessages;
      })
    );
  }

  markSelectedAsUnread(): Observable<any[]> {
    const unreadMessageIds = this.selectedMessages.map((email) => email.id);

    const unreadRequests = unreadMessageIds.map((messageId) =>
      this.googleApiService.markAsUnread('me', messageId).pipe(
        catchError((error) => {
          console.error(`Failed to mark email ${messageId} as unread:`, error);
          return of(null);
        })
      )
    );

    return forkJoin(unreadRequests).pipe(
      map(() => {
        this.selectedMessages = this.selectedMessages.map((email) => {
          if (unreadMessageIds.includes(email.id)) {
            return {
              ...email,
              labels: [...email.labels, 'UNREAD']
            };
          }
          email.isUnread = true;
          return email;
        });

        return this.selectedMessages;
      })
    );
  }

  archiveSelectedEmails(): Observable<any[]> {
    const archiveMessageIds = this.selectedMessages.map((email) => email.id);

    const archiveRequests = archiveMessageIds.map((messageId) =>
      this.googleApiService.archiveEmail('me', messageId).pipe(
        catchError((error) => {
          console.error(`Failed to archive email ${messageId}:`, error);
          return of(null);
        })
      )
    );

    return forkJoin(archiveRequests).pipe(
      map(() => {
        this.selectedMessages = this.selectedMessages.map((email) => {
          if (archiveMessageIds.includes(email.id)) {
            return {
              ...email,
              labels: email.labels.filter((l) => l !== 'INBOX') // Remove from INBOX (Archive)
            };
          }
          return email;
        });

        return this.selectedMessages;
      })
    );
  }

  markSelectedAsSpam(): Observable<any[]> {
    const spamMessageIds = this.selectedMessages.map((email) => email.id);

    const spamRequests = spamMessageIds.map((messageId) =>
      this.googleApiService.markAsSpam('me', messageId).pipe(
        catchError((error) => {
          console.error(`Failed to mark email ${messageId} as spam:`, error);
          return of(null);
        })
      )
    );

    return forkJoin(spamRequests).pipe(
      map(() => {
        this.selectedMessages = this.selectedMessages.map((email) => {
          if (spamMessageIds.includes(email.id)) {
            return {
              ...email,
              labels: [...email.labels.filter((l) => l !== 'INBOX'), 'SPAM'] // Remove INBOX, add SPAM
            };
          }
          email.isSpam = true;
          return email;
        });

        return this.selectedMessages;
      })
    );
  }

  convertAttachmentsToFiles(messageId: string, attachments: EmailAttachment[]): Observable<File[]> {
    
    const validAttachments = attachments.filter(att => att.dataId);
  
    const attachmentObservables: Observable<File>[] = validAttachments.map(att => {
      return this.googleApiService.getAttachmentData(messageId, att.dataId!).pipe(
        map(base64Data => {
          const standardBase64 = base64Data.replace(/-/g, '+').replace(/_/g, '/');
          const byteCharacters = atob(standardBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: att.mimeType });
          return new File([blob], att.filename, { type: att.mimeType });
        })
      );
    });
  
    return forkJoin(attachmentObservables);
  }
  
  //=========================================================================================================================================================
}