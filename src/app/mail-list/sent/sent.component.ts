import { Component, inject } from '@angular/core';
import { MailTableComponent } from '../mail-table/mail-table.component';

import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';

@Component({
  selector: 'app-sent',
  standalone: true,
  imports: [MailTableComponent],
  templateUrl: './sent.component.html',
  styleUrl: './sent.component.css',
})
export class SentComponent {
  sentEmails!: EmailDetails[];
  component: string = 'sent';

  constructor(
  
    private fetchedMailService: FetchedMailService
  ) {}

  ngOnInit(): void {
    this.fetchedMailService.loading.set(true);


    setTimeout(() => {
      this.sentEmails = this.fetchedMailService.getSentEmails();
      this.fetchedMailService.loading.set(false);
    }, 2000);
  }

}
