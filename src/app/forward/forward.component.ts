import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GoogleApiService } from '../shared/google-api.service';
import { message, drafts } from '../shared/messages';
import { FormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { Router } from '@angular/router';
import { TabSectionComponent } from '../tabs-section/tabs-section.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { EmailDetails, FetchedMailService } from '../shared/fetched-mail.service';

@Component({
  selector: 'app-forward',
  standalone: true,
  imports: [FormsModule, Editor, TabSectionComponent, CommonModule],
  templateUrl: './forward.component.html',
  styleUrl: './forward.component.css',
})
export class ForwardComponent {
  to: string = '';
  Cc: string = '';
  title: string = '';
  text: string = '';
  private message!: EmailDetails;

  constructor(
    private fetchedMailService: FetchedMailService,
    private googleApiService: GoogleApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchedMailService.forward$.subscribe((msg) => {
      if (msg) {
        this.message = msg;
        this.title = this.message.subject;
        this.Cc = this.message.cc;
        this.text = this.message.body;
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

  save() {
    const msg: message = {
      name: this.to,
      title: this.title,
      body: 'CC : ' + this.Cc + '\n' + this.text,
      type: this.Cc ? 'work' : 'personal',
      time: Date.now().toString(),
      marked: false,
      important: false,
    };
    drafts.push(msg);
    console.log(msg);
  }
  reset() {
    this.to = '';
    this.Cc = '';
    this.title = '';
    this.text = '';
    this.router.navigate(['/dashboard/new-message']);
  }

  selectedFiles: File[] = [];

  handleFileInput(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  forward() {
    this.forwardEmail(
      'me',
      this.message,
      this.to,
      this.selectedFiles
    ).subscribe({
      next: () => {
        alert('Email forwarded successfully!');
        this.reset();
      },
      error: (err: { message: string }) =>
        alert('Failed to forward email: ' + err.message),
    });
  }

  forwardEmail(
    userId: string,
    originalMessage: any,
    to: string,
    attachments: any[] = []
  ): Observable<any> {
    const forwardedEmail = this.encodeForwardedEmail(
      originalMessage,
      to,
      attachments
    );

    return this.googleApiService.forwardMail(userId, forwardedEmail);
  }

  encodeForwardedEmail(
    originalMessage: any,
    to: string,
    attachments: any[] = []
  ): string {
    let boundary = 'boundary_' + new Date().getTime();
    let emailBody = `MIME-Version: 1.0\r\n`;
    emailBody += `To: ${to}\r\n`;
    emailBody += `Subject: Fwd: ${originalMessage.subject}\r\n`;
    emailBody += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

    // Add forwarded email as HTML
    emailBody += `--${boundary}\r\n`;
    emailBody += `Content-Type: text/html; charset="UTF-8"\r\n\r\n`;
    emailBody += `<p><strong>Forwarded message:</strong></p>`;
    emailBody += `<p>From: ${originalMessage.from}<br>`;
    emailBody += `Date: ${originalMessage.date}<br>`;
    emailBody += `Subject: ${originalMessage.subject}</p>`;
    emailBody += `<hr>`;
    emailBody += `${originalMessage.body}\r\n\r\n`;

    // Attach files
    attachments.forEach((file) => {
      emailBody += `--${boundary}\r\n`;
      emailBody += `Content-Type: ${file.type}; name="${file.filename}"\r\n`;
      emailBody += `Content-Disposition: attachment; filename="${file.filename}"\r\n`;
      emailBody += `Content-Transfer-Encoding: base64\r\n\r\n`;
      emailBody += `${file.content}\r\n\r\n`;
    });

    emailBody += `--${boundary}--`;

    return btoa(emailBody)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
