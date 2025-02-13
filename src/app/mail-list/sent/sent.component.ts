import { Component, inject } from '@angular/core';
import { MailTableComponent } from '../mail-table/mail-table.component';
import { DashboardService } from '../../dashboard/dashboard.service';
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
    private dashboardService: DashboardService,
    private fetchedMailService: FetchedMailService
  ) {}

  ngOnInit(): void {
    this.dashboardService.emails$.subscribe((updatedEmails) => {
      // console.log(updatedEmails);
      this.sentEmails = this.fetchedMailService.getSentEmails();
    });
  }

}
