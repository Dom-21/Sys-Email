import { Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, single } from 'rxjs';
import { DashboardService } from '../dashboard/dashboard.service';
import { GoogleApiService } from './google-api.service';
import { HttpClient } from '@angular/common/http';

export interface EmailAttachment {
  filename: string;
  mimeType: string;
  size: number;
  dataId?: string; // For referencing attachment data
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
}

@Injectable({
  providedIn: 'root',
})
export class FetchedMailService {
  searchMessages(searchTerm: string) {
    throw new Error('Method not implemented.');
  }
  reloadCurrentRoute() {
    throw new Error('Method not implemented.');
  }
  inboxLength = signal<number>(0);
  draftsLength = signal<number>(0);
  currentMessage = signal<EmailDetails | null>(null);
  selectedMessages: EmailDetails[] = [];

  private replySubject = new BehaviorSubject<EmailDetails | null>(null);
  private forwardSubject = new BehaviorSubject<EmailDetails | null>(null);

  reply$ = this.replySubject.asObservable();
  forward$ = this.forwardSubject.asObservable();

  constructor(private dashboardServices: DashboardService, private googleApiService: GoogleApiService,
    private httpClient: HttpClient
  ) { }

  replyMail(msg: EmailDetails) {
    this.replySubject.next(msg);
  }

  forwardMail(msg: EmailDetails) {
    this.forwardSubject.next(msg);
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
    };
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

  filterInboxEmails(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg))
      .filter((email) => email.labels.includes('INBOX'))
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          // console.log(email);

          emailMap.set(email.messageId, email);
        }
      });

    this.inboxLength.set(emailMap.size);

    return Array.from(emailMap.values());
  }

  getInboxEmails(messages: any[]): EmailDetails[] {
    return this.filterInboxEmails(this.dashboardServices.getAllEmails());
  }

  filterMarkedEmails(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg))
      .filter((email) => email.labels.includes('STARRED'))
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          // console.log(email);

          emailMap.set(email.messageId, email);
        }
      });

    return Array.from(emailMap.values());
  }

  getMarkedEmails(): EmailDetails[] {
    return this.filterMarkedEmails(this.dashboardServices.getAllEmails());
  }

  filterSentEmails(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg))
      .filter((email) => email.labels.includes('SENT'))
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          // console.log(email);

          emailMap.set(email.messageId, email);
        }
      });

    return Array.from(emailMap.values());
  }

  getSentEmails(): EmailDetails[] {
    return this.filterSentEmails(this.dashboardServices.getAllEmails());
  }

  filterImportantEmails(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg))
      .filter((email) => email.labels.includes('IMPORTANT'))
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          // console.log(email);

          emailMap.set(email.messageId, email);
        }
      });

    return Array.from(emailMap.values());
  }

  getImportantEmails(): EmailDetails[] {
    return this.filterImportantEmails(this.dashboardServices.getAllEmails());
  }

  filterArchivedEmails(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg))
      .filter(
        (email) =>
          !email.labels.includes('INBOX') &&
          !email.labels.includes('TRASH') &&
          !email.labels.includes('SPAM')
      ) // emails that are not in INBOX, TRASH, or SPAM folder then there said to be archieve
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          emailMap.set(email.messageId, email);
        }
      });

    return Array.from(emailMap.values());
  }

  getArchivedEmails(): EmailDetails[] {
    return this.filterArchivedEmails(this.dashboardServices.getAllEmails());
  }

  filterDraftEmails(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg)) // Convert each message
      .filter((email) => email.labels.includes('DRAFT'))
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          emailMap.set(email.messageId, email);
        }
      });
    this.draftsLength.set(emailMap.size);
    return Array.from(emailMap.values());
  }

  getDraftEmails(): EmailDetails[] {
    return this.filterDraftEmails(this.dashboardServices.getAllEmails());
  }

  filterSpamEmails(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg)) // Convert each message
      .filter((email) => email.labels.includes('SPAM')) // Filter only spam emails
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          emailMap.set(email.messageId, email);
        }
      });

    return Array.from(emailMap.values());
  }

  getSpamEmails(): EmailDetails[] {
    return this.filterSpamEmails(this.dashboardServices.getAllEmails());
  }

  filterTrashEmails(messages: any[]): EmailDetails[] {
    if (!messages || messages.length === 0) return [];

    const emailMap = new Map<string, EmailDetails>();

    messages
      .map((msg) => this.convertToEmailDetails(msg)) // Convert each message
      .filter((email) => email.labels.includes('TRASH')) // Filter only trash emails
      .forEach((email) => {
        if (!emailMap.has(email.messageId)) {
          emailMap.set(email.messageId, email);
        }
      });

    return Array.from(emailMap.values());
  }

  getTrashEmails(): EmailDetails[] {
    return this.filterTrashEmails(this.dashboardServices.getAllEmails());
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
          email.isUnread=false;
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
          email.isUnread=true;
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
}
