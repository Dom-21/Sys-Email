import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { GoogleApiService } from '../shared/google-api.service';
import { TabSectionComponent } from '../tabs-section/tabs-section.component';
import { CommonModule } from '@angular/common';
import { EmailDetails } from '../shared/fetched-mail.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [
    Editor,
    FormsModule,
    CommonModule,
    FloatLabelModule,
    ReactiveFormsModule,
    TabSectionComponent,
  ],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.css',
})
export class NewMessageComponent implements OnInit {
  to: string = '';
  Cc: string = '';
  title: string = '';
  text: string = '';
  formGroup: FormGroup<any> | undefined;
  on_label: any;
  message!: EmailDetails;
  selectedFiles: File[] = [];

  tabs = false;
  @ViewChild('tabsMenu') tabsMenu!: ElementRef;

  constructor(private googleApiService: GoogleApiService) { }

  ngOnInit(): void { }

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
      (response) => alert('Email sent successfully'),
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
      next: (response) => alert('Draft saved successfully'),
      error: (err) => console.error('Error saving draft:', err)
    });
  }
}
