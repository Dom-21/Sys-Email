import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TabSectionComponent } from '../tabs-section/tabs-section.component';

import { GoogleApiService } from '../shared/google-api.service';
import { EmailDetails, FetchedMailService } from '../shared/fetched-mail.service';

@Component({
  selector: 'app-mail-draft',
  standalone:true,
  imports: [Editor,
      FormsModule,
      CommonModule,
      FloatLabelModule,
      ReactiveFormsModule,
      TabSectionComponent,],
  templateUrl: './mail-draft.component.html',
  styleUrl: './mail-draft.component.css'
})
export class MailDraftComponent {
  to: string = '';
    Cc: string = '';
    title: string = '';
    text: string = '';
    formGroup: FormGroup<any> | undefined;
    on_label: any;
    message!: any;
    selectedFiles: File[] = [];
  
    tabs = false;
    @ViewChild('tabsMenu') tabsMenu!: ElementRef;
  
    constructor(private googleApiService: GoogleApiService, private fetchedMailService: FetchedMailService) { 
      
    }
  
    ngOnInit(): void { 
      this.message = this.fetchedMailService.currentMessage();
      if(this.message){
        this.to = this.message.to;
        this.Cc = this.message.Cc;
        this.title = this.message.subject;
        this.text = this.message.body;
        
      }
      console.log('Draft Loaded:', this.message);
      console.log('To Field:', this.to);

    }
  
    onToggleTabs() {
      this.tabs = !this.tabs;
    }
  
    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {
      if (this.tabs && !this.tabsMenu.nativeElement.contains(event.target)) {
        this.tabs = false;
      }
    }
  
    handleFileInput(event: any) {
      this.selectedFiles = Array.from(event.target.files);
    }
  
    reset() {
      this.to = '';
      this.Cc = '';
      this.title = '';
      this.text = '';
      this.selectedFiles = [];
    }
  
    async sendEmail() {
      const userId = 'me';
      const rawMail = await this.buildRawEmail();
  
      if (!rawMail) {
        console.error('Failed to build raw email. Check input fields.');
        return;
      }
  
      this.googleApiService.sendEmail(userId, rawMail).subscribe(
        (response) => alert('Email sent successfully:' + response),
        (error) => {
          console.error('Error sending email:', error);
          console.error('Raw Email Content:', rawMail);
        }
      );
    }
  
    async buildRawEmail(): Promise<string> {
      if (!this.to?.trim()) {
        console.error('Recipient address is missing!');
        return '';
      }
  
      let boundary = `boundary_${Date.now()}`;
      const senderEmail = await this.googleApiService.getEmailId();
  
      let emailContent = `From: ${senderEmail}
  To: ${this.to}
  Cc: ${this.Cc ? this.Cc : ''}
  Subject: ${this.title}
  MIME-Version: 1.0
  Content-Type: multipart/mixed; boundary="${boundary}"
  
  --${boundary}
  Content-Type: text/html; charset="UTF-8"
  
  ${this.text}
  
  `;
  
      for (let file of this.selectedFiles) {
        const fileData = await this.fileToBase64(file);
        emailContent += `
  --${boundary}
  Content-Type: ${file.type}; name="${file.name}"
  Content-Disposition: attachment; filename="${file.name}"
  Content-Transfer-Encoding: base64
  
  ${fileData}
  
  `;
      }
  
      emailContent += `--${boundary}--`;
  
      // Use URL-safe Base64 encoding
      return this.encodeBase64(emailContent);
    }
  
    fileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });
    }
  
    private encodeBase64(input: string): string {
      return btoa(unescape(encodeURIComponent(input)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    async save() {
      const rawMail = await this.buildRawEmail();
  
      if (!rawMail) {
        console.error('Failed to build raw email. Check input fields.');
        return;
      }
  
      this.googleApiService.saveDraft('me', rawMail).subscribe({
        next: (response) => console.log('Draft saved successfully:', response),
        error: (err) => console.error('Error saving draft:', err)
      });
    }
    
  
    async saveDraft() {
      const userId = 'me';
      const rawMail = await this.buildRawEmail();
    
      if (!rawMail) {
        console.error('Failed to build raw email. Check input fields.');
        return;
      }
    
      const draftId = this.message?.id; 
      const requestBody = {
        message: {
          raw: rawMail,
        },
      };
    
      // If draft exists, update it; otherwise, create a new one
      let saveDraftRequest;
      if (draftId) {
        saveDraftRequest = this.googleApiService.updateDraft(userId, draftId, requestBody);
      } else {
        saveDraftRequest = this.googleApiService.createDraft(userId, requestBody);
      }
    
      saveDraftRequest.subscribe({
        next: (response: any) => {
          console.log('Draft saved successfully:', response);
          this.message.id = response.id; // Store draft ID for future updates
        },
        error: (err: any) => console.error('Error saving draft:', err),
      });
    }

    async sendDraft() {
      console.log('Fetching Draft ID:', this.message?.id);
    
      if (!this.message?.id) {
        console.error('Draft ID is missing. Save the draft first.');
        alert('Draft ID is missing. Save the draft before sending.');
        return;
      }
    
      // Step 1: Get the draft details using draft ID
      this.googleApiService.getDraft('me', this.message.messageId).subscribe({
        next: async (draftResponse: any) => {
          console.log('Fetched Draft:', draftResponse);
    
          if (!draftResponse?.message?.id) {
            console.error('Message ID not found in the draft.');
            alert('Message ID not found in the draft.');
            return;
          }
    
          const messageId = draftResponse.message.id;
          console.log('Extracted Message ID:', messageId);
    
          // Step 2: Build the raw email
          const rawMail = await this.buildRawEmail();
          if (!rawMail) {
            console.error('Failed to build raw email.');
            return;
          }
    
          const encodedRawMail = this.encodeBase64(rawMail);
          console.log('Encoded Raw Email:', encodedRawMail);
    
          // Step 3: Send the email using the extracted message ID
          this.googleApiService.sendDraft('me', encodedRawMail, messageId).subscribe({
            next: (response) => console.log('Draft sent successfully:', response),
            error: (error) => console.error('Error sending draft:', error),
          });
        },
        error: (error: any) => {
          console.error('Error fetching draft:', error);
          alert('Error fetching draft. It might have been deleted.');
        },
      });
    }
    
    
    
    isDraftEdited(): boolean {
      if (!this.message) return false;
    
      return (
        this.to !== this.message.to ||
        this.Cc !== this.message.cc ||
        this.title !== this.message.subject ||
        this.text !== this.message.body ||
        this.areAttachmentsChanged()
      );
    }
    
    areAttachmentsChanged(): boolean {
      if (this.selectedFiles.length !== this.message.attachments.length) return true;
    
      const currentAttachmentNames = this.message.attachments.map((att: { filename: any; }) => att.filename);
      const selectedFileNames = this.selectedFiles.map((file) => file.name);
    
      return (
        selectedFileNames.some((name) => !currentAttachmentNames.includes(name)) ||
        currentAttachmentNames.some((name: string) => !selectedFileNames.includes(name))
      );
    }
    
    async sendingDraft() {
      console.log('Fetching Draft ID:', this.message?.id);
    
      if (!this.message?.id) {
        console.error('Draft ID is missing. Save the draft first.');
        alert('Draft ID is missing. Save the draft before sending.');
        return;
      }
    
      // Step 1: Get the draft details using draft ID
      this.googleApiService.getDraft('me', this.message.id).subscribe({
        next: async (draftResponse: any) => {
          console.log('Fetched Draft:', draftResponse);
    
          if (!draftResponse?.message?.id) {
            console.error('Message ID not found in the draft.');
            alert('Message ID not found in the draft.');
            return;
          }
    
          const messageId = draftResponse.message.id;
          console.log('Extracted Message ID:', messageId);
    
          // Step 2: Build the raw email
          const rawMail = await this.buildRawEmail();
          if (!rawMail) {
            console.error('Failed to build raw email.');
            return;
          }
    
          const encodedRawMail = this.encodeBase64(rawMail);
          console.log('Encoded Raw Email:', encodedRawMail);
    
          // Step 3: Send the email using the extracted message ID
          this.googleApiService.sendDraft('me', encodedRawMail, this.message.threadId).subscribe({
            next: (response) => console.log('Draft sent successfully:', response),
            error: (error) => console.error('Error sending draft:', error),
          });
        },
        error: (error) => {
          console.error('Error fetching draft:', error);
          alert('Error fetching draft. It might have been deleted.');
        },
      });
    }
    
  }