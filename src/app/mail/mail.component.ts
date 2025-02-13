import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { message } from '../shared/messages';
import { Router } from '@angular/router';
import { EmailAttachment, EmailDetails, FetchedMailService } from '../shared/fetched-mail.service';
import { GoogleApiService } from '../shared/google-api.service';


@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [CommonModule] ,
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.css',
})
export class MailComponent implements OnInit {
  message!: EmailDetails | null; 
  component:string= ''
  

  constructor(
    private location: Location,
    private fetchedMailService: FetchedMailService,
    private router: Router,
    private googleApiService: GoogleApiService
  ) {}

  ngOnInit(): void {
    this.message = this.fetchedMailService.currentMessage() ;
    
    if (this.message) {
      if (this.message.labels.includes('UNREAD')) {
        
        this.googleApiService.markAsRead('me', this.message.id).subscribe({
            next: () => {
                console.log('Email marked as read');
                if(this.message){
                  console.log("Read");
                  this.message.isUnread = false;
                  this.message.labels = this.message?.labels.filter(label => label !== 'UNREAD'); 
                }
            },
            error: (err) => console.error('Error marking email as read', err)
        });
    } 
    } else {
      console.log(this.component);
    }
  }


  showPreview: boolean = false;
  selectedAttachment: EmailAttachment | null = null;

 
    isImage(attachment: EmailAttachment): boolean {
      return attachment.mimeType.startsWith('image/');
    }
  
 
    isPdf(attachment: EmailAttachment): boolean {
      return attachment.mimeType === 'application/pdf';
    }
  
  
    isVideo(attachment: EmailAttachment): boolean {
      return attachment.mimeType.startsWith('video/');
    }
  
  
    isAudio(attachment: EmailAttachment): boolean {
      return attachment.mimeType.startsWith('audio/');
    }
  
  
    getAttachmentUrl(attachment: EmailAttachment): string {
     
      return `assets/attachments/${attachment.filename}`; 
    }
  
 
    openPreview(attachment: EmailAttachment): void {
      this.selectedAttachment = attachment;
      this.showPreview = true;
    }
  
    
    closePreview(): void {
      this.showPreview = false;

      this.selectedAttachment = null;
    }


  extractName(fullAddress: string): string {
    return fullAddress.includes('<') ? fullAddress.split('<')[0].trim() : fullAddress;
  }
  
  getEmailCategory(labels: string[]): string {
    if (!labels || labels.length === 0) return 'Unknown';
  
    if (labels.includes('INBOX')) return 'inbox';
    if (labels.includes('SENT')) return 'sent';
    if (labels.includes('DRAFT')) return 'draft';
  
    return 'Other';
  }
  
  onToggleMarked(message: EmailDetails): void {
    if (message.labels.includes('STARRED')) {
      
      this.googleApiService.unstarEmail('me', message.id).subscribe({
          next: () => {
              console.log('Email marked');
              message.isStarred = !message.isStarred;
              message.labels = message.labels.filter(label => label !== 'STARRED'); 
          },
          error: (err) => console.error('Error unmarking email', err)
      });
    } else {
      
      this.googleApiService.starEmail('me', message.id).subscribe({
        next: () => {
              message.isStarred = !message.isStarred; 
              console.log('Email unmarked');
              message.labels.push('STARRED'); 
          },
          error: (err) => console.error('Error marking email as important', err)
      });
  }
}

  onToggleImportant(message: EmailDetails): void {
    if (message.labels.includes('IMPORTANT')) {
      
      this.googleApiService.unmarkImportant('me', message.id).subscribe({
          next: () => {
              // console.log('Email unmarked as important');
              message.isImportant = !message.isImportant;
              message.labels = message.labels.filter(label => label !== 'IMPORTANT'); 
          },
          error: (err) => console.error('Error unmarking email', err)
      });
    } else {
      
      this.googleApiService.markImportant('me', message.id).subscribe({
        next: () => {
              message.isImportant = !message.isImportant; 
              // console.log('Email marked as important');
              message.labels.push('IMPORTANT'); 
          },
          error: (err) => console.error('Error marking email as important', err)
      });
  }
  }

  goBack() {
    this.location.back();
  }

  onClickReply() {
    if(this.message){
      this.fetchedMailService.replyMail(this.message);
      this.router.navigate(['/dashboard/reply']);
    }
  }

  onClickForward() {
    if(this.message){
      this.fetchedMailService.forwardMail(this.message);
      this.router.navigate(['/dashboard/forward']);
    }
  }

  getBackgroundColor(message: EmailDetails) {
    const labels=message.labels;
    var type = 'work';
    var categoryLabels = labels.filter(label => label.startsWith("CATEGORY_"));
    switch(categoryLabels[0]) {
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





  
}
