import { Component, inject } from '@angular/core';
import { MailTableComponent } from '../mail-table/mail-table.component';
import { DashboardService } from '../../dashboard/dashboard.service';
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
    private dashboardService: DashboardService,
    private fetchedMailService: FetchedMailService
  ) {}

  ngOnInit(): void {
    this.dashboardService.emails$.subscribe((updatedEmails) => {
      // console.log(updatedEmails);
      this.spamEmails = this.fetchedMailService.getSpamEmails();
    });
  }


 

  
}
