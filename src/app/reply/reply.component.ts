import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleApiService } from '../shared/google-api.service';
import { Editor } from 'primeng/editor';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TabSectionComponent } from '../tabs-section/tabs-section.component';
import { CommonModule, Location } from '@angular/common';
import { EmailDetails, FetchedMailService } from '../shared/fetched-mail.service';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [FormsModule, Editor, TabSectionComponent, CommonModule],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css',
})
export class ReplyComponent implements OnInit {
  to: string = '';
  Cc: string = '';
  title: string = '';
  text: string = '';
  private message!: EmailDetails;

  constructor(
    private fetchedMailService: FetchedMailService,
    private googleApiService: GoogleApiService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.fetchedMailService.reply$.subscribe((msg) => {

      if (msg) {
        this.message = msg;
        this.Cc = this.message.cc;
        this.to = this.message.from;
        this.title = this.message.subject;
      }
    });
  }

  tabs = false;
  @ViewChild('tabsMenu') tabsMenu!: ElementRef;

  onToggleTabs() {
    this.tabs = !this.tabs;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.tabs && !this.tabsMenu.nativeElement.contains(event.target)) {
      this.tabs = false;
    }
  }

  save() { }
  reset() {
    console.log(this.sanitizeHtml(this.text));
    this.to = '';
    this.Cc = '';
    this.title = '';
    this.text = '';
    this.fetchedMailService.goBack();
  }

  sanitizeHtml(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  selectedFiles: File[] = [];

  handleFileInput(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  replyToEmail() {
    // console.log("Fetched MEssage: ", this.message);
    this.replyEmail(
      this.message,
      this.message.from,
      this.message.threadId
    );
  }

  async replyEmail(
    originalMessage: EmailDetails,
    originalFrom: string,
    threadId: string
  ) {
    if (!originalMessage || !originalFrom || !threadId) {
      console.error(
        'error: Missing required email data Message ID, Sender , Thread ID.'
      );
      return;
    }

    const userId = 'me';
    // console.log(this.to);

    const rawMail = await this.buildReplyEmail(
      originalMessage,
      threadId
    );

    if (!rawMail) {
      console.error('Error: Failed to build reply email.');
      return;
    }
    // console.log(rawMail);


    this.googleApiService.sendReplyEmail(userId, rawMail, threadId).subscribe(
      (response) => {
        this.router.navigate(['/dashboard']);
        // alert('Reply sent successfully.');
        this.fetchedMailService.showMessage('Reply sent successfully.');
        this.location.back();
      },
      (error) => {
        console.error('error sending reply:', error);
        console.error('raw Email:', rawMail);
      }
    );
  }

 
  async buildReplyEmail(originalMessage: EmailDetails, threadId: string): Promise<string> {
    if (!this.to || this.to.trim() === '') {
        console.error('Error: Recipient Address is missing!');
        return '';
    }

    const senderEmail = this.googleApiService.getEmailId();
    if (!senderEmail) {
        console.error('Error: Unable to retrieve sender email!');
        return '';
    }

    const boundary = `boundary_${Date.now()}`;
    let emailContent = `From: ${senderEmail}
To: ${this.to}
Cc: ${this.Cc ? this.Cc:''} 
Subject: Re: ${this.title}
In-Reply-To: ${originalMessage.messageId}
References: ${originalMessage.references}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="${boundary}"
--${boundary}

Content-Type: text/html; charset="UTF-8"

<p>${this.text}</p>

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

    // console.log('Raw Email Content:\n', emailContent);
    return this.encodeBase64(emailContent);
}


private encodeBase64(input: string): string {
  return btoa(unescape(encodeURIComponent(input))) 
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); 
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
}
