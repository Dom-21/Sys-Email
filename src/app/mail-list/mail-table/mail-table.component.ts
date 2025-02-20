import { Component, EventEmitter, Input, Output, Signal, signal } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';
import { GoogleApiService } from '../../shared/google-api.service';

@Component({
  selector: 'app-mail-table',
  standalone: true,
  imports: [CheckboxModule, FormsModule, CommonModule],
  templateUrl: './mail-table.component.html',
  styleUrl: './mail-table.component.css'
})
export class MailTableComponent {
  @Input() messages: EmailDetails[] =[] // Input for passing the messages
  @Input() component: string = '';
  @Output() toggleMarked = new EventEmitter<EmailDetails>(); // Output for marking
  @Output() toggleImportant = new EventEmitter<EmailDetails>(); // Output for marking important
  mailService: any;
  loading = signal<boolean>(false);
  mails: EmailDetails[] = [];

 
  

  constructor(private router: Router, private fetchedEmailService: FetchedMailService, private googleApiService: GoogleApiService,){
    this.loading = fetchedEmailService.loading;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = this.fetchedEmailService.loading;


  }
  onToggleMarked(message: EmailDetails): void {
    if (message.labels.includes('STARRED')) {
      
      this.googleApiService.unstarEmail('me', message.id).subscribe({
          next: () => {
              // alert('Email marked as star');
              this.fetchedEmailService.showMessage("Removed as starred.");
              message.isStarred = !message.isStarred;
              message.labels = message.labels.filter(label => label !== 'STARRED'); 
          },
          error: (err) => console.error('Error unmarking email', err)
      });
    } else {
      
      this.googleApiService.starEmail('me', message.id).subscribe({
        next: () => {
              message.isStarred = !message.isStarred; 
              this.fetchedEmailService.showMessage("Email marked as star.");
              
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
              // alert('Email unmarked as important');
              this.fetchedEmailService.showMessage('Removed as important')
              message.isImportant = !message.isImportant;
              message.labels = message.labels.filter(label => label !== 'IMPORTANT'); 
          },
          error: (err) => console.error('Error unmarking email', err)
      });
    } else {
      
      this.googleApiService.markImportant('me', message.id).subscribe({
        next: () => {
              message.isImportant = !message.isImportant; 
              this.fetchedEmailService.showMessage('Email marked as important')
              message.labels.push('IMPORTANT'); 
          },
          error: (err) => console.error('Error marking email as important', err)
      });
  }
  }

  selectedMap: { [key: string]: boolean } = {};

  onSelectMessage(message: EmailDetails): void {
    if (this.selectedMap[message.messageId]) {
      this.fetchedEmailService.selectedMessages.push(message);
    } else {
      this.fetchedEmailService.selectedMessages = this.fetchedEmailService.selectedMessages.filter((m: { messageId: string; }) => m.messageId !== message.messageId);
    }
    // console.log(this.fetchedEmailService.selectedMessages);
  }

  extractName(message: EmailDetails): string {
    const fullAddress = this.component==='sent' ? message.to : message.from;
    return fullAddress.includes('<') ? fullAddress.split('<')[0].trim() : fullAddress;
  }

  getBackgroundColor(message: EmailDetails) {
    const labels=message.labels;
   
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

  onMessageClick(message: EmailDetails) {
    if(message.draftId!=='none'){
      // console.log("drafts");
      this.fetchedEmailService.currentMessage.set(message);
      this.router.navigate(['/dashboard/mail-draft']);
    }else{
      this.fetchedEmailService.currentMessage.set(message);
      this.router.navigate(['/dashboard/mail']);
    }
    
  }
}
