import { Component, inject } from '@angular/core';
import { MailTableComponent } from '../mail-table/mail-table.component';
import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';

@Component({
  selector: 'app-spam',
  imports: [MailTableComponent],
  standalone: true,
  templateUrl: './spam.component.html',
  styleUrl: './spam.component.css',
})
export class SpamComponent {
 
  spamEmails!: EmailDetails[];
  emailSubscription: any;
  component: string = 'spam';

  constructor(
    private fetchedMailService: FetchedMailService
  ) {}

  ngOnInit(): void {
    this.fetchedMailService.loading.set(true);


    setTimeout(() => {
      this.spamEmails = this.fetchedMailService.getSpamEmails();
      this.fetchedMailService.loading.set(false);
    }, 3000);
  }


 

  
}
