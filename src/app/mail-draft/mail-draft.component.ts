import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TabSectionComponent } from '../tabs-section/tabs-section.component';

import { GoogleApiService } from '../shared/google-api.service';
import { EmailDetails, FetchedMailService } from '../shared/fetched-mail.service';
import { Route, Router } from '@angular/router';

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
    message:any;
    selectedFiles:File[] = [];
  
    tabs = false;
    @ViewChild('tabsMenu') tabsMenu!: ElementRef;
  
    constructor(private googleApiService: GoogleApiService, private fetchedMailService: FetchedMailService, private router: Router) { 
      
    }
  
    async ngOnInit(): Promise<void> { 
      this.message = this.fetchedMailService.currentMessage();
      if(this.message){
        this.to = this.message.to;
        this.Cc = this.message.cc;
        this.title = this.message.subject;
        this.text = this.message.body;
        await this.fetchedMailService.convertAttachmentsToFiles(this.message.messageId, this.message.attachments).subscribe(
          (files: File[]) => {
            this.selectedFiles.push(...files);
            // console.log('Converted Files:', this.selectedFiles);
          },
          error => {
            console.error('Error converting attachments to Files:', error);
          }
        );
        
        
      }else{
        this.router.navigate(['/dashboard']);
      }
      // console.log('Draft Loaded:', this.message);

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
      const arr = Array.from(event.target.files) as File[];
      this.selectedFiles.push(...arr);
    }
    
  
    reset() {
      this.to = '';
      this.Cc = '';
      this.title = '';
      this.text = '';
      this.selectedFiles = [];
    }
  
    async buildRawEmail(): Promise<string | null> {
     
      if (!this.to.trim()) {
        this.fetchedMailService.showMessage("Error: Recipient address is missing!");
        return null;
      }
    
      
      const boundary = "boundary_" + new Date().getTime();
      let emailParts: string[] = [];
    
     
      emailParts.push(`To: ${this.to}`);
      if (this.Cc && this.Cc.trim() !== '') {
        emailParts.push(`Cc: ${this.Cc}`);
      }
      emailParts.push(`Subject: ${this.title}`);
      emailParts.push(`MIME-Version: 1.0`);
      emailParts.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
      emailParts.push(""); 
    
    
      emailParts.push(`--${boundary}`);
      emailParts.push(`Content-Type: text/plain; charset="UTF-8"`);
      emailParts.push(`Content-Transfer-Encoding: 7bit`);
      emailParts.push("");
      emailParts.push(`${this.text}`);
      emailParts.push(""); 
    
      
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        for (const file of this.selectedFiles) {
          
          const fileBase64 = await this.readFileAsBase64(file);
    
          
          emailParts.push(`--${boundary}`);
          emailParts.push(`Content-Type: ${file.type}; name="${file.name}"`);
          emailParts.push(`Content-Disposition: attachment; filename="${file.name}"`);
          emailParts.push(`Content-Transfer-Encoding: base64`);
          emailParts.push("");
          emailParts.push(fileBase64);
          emailParts.push("");
        }
      }
    
      
      emailParts.push(`--${boundary}--`);
    
  
      const email = emailParts.join("\r\n");
      // console.log("Raw Email Before Encoding:\n", email);
    
     
      const encodedEmail = btoa(email)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      return encodedEmail;
    }
    
    
    readFileAsBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          
          const result = reader.result as string;
          
          const base64Index = result.indexOf('base64,') + 'base64,'.length;
          resolve(result.substring(base64Index));
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }
    
    
  
    async saveDraft() {
      const userId = 'me';
      const rawMail = await this.buildRawEmail();
      const draftId = this.message.draftId;
    
      if (!rawMail) {
        console.error('Failed to build raw email. Check input fields.');
        return;
      }
    
      this.googleApiService.updateDraft(userId, draftId, rawMail).subscribe(
        (updateResponse) => {
          this.fetchedMailService.showMessage("Draft updated successfully.")
          this.router.navigate(['/dashboard']);
        },
        (error) => console.error('Error updating draft:', error)
      );
    }
   
    
    async sendDraft(draftId: string) {
      const userId = 'me';
      const rawMail = await this.buildRawEmail();
    
      if (!rawMail) {
        console.error('Failed to build raw email. Check input fields.');
        return;
      }
    
      
      this.googleApiService.updateDraft(userId, draftId, rawMail).subscribe(
        (updateResponse) => {
          // console.log('Draft updated successfully:', updateResponse);
    
         
          this.googleApiService.sendDraft(userId, updateResponse.id).subscribe(
            (sendResponse: any) => {
              this.fetchedMailService.showMessage("Draft sent successfully.");
              this.router.navigate(['/dashboard']);
            },
            (error: any) => console.error('Error sending draft:', error)
          );
        },
        (error) => console.error('Error updating draft:', error)
      );
    }
    
    
  }