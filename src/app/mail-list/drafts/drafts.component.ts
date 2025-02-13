import { Component, inject } from '@angular/core';
import { MailTableComponent } from '../mail-table/mail-table.component';
import { DashboardService } from '../../dashboard/dashboard.service';
import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [MailTableComponent],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.css',
})
export class DraftsComponent {
  draftEmails!: EmailDetails[];
  component: string = 'drafts';

  constructor(
    private dashboardService: DashboardService,
    private fetchedMailService: FetchedMailService
  ) {}

  ngOnInit(): void {
    this.dashboardService.emails$.subscribe((updatedEmails) => {
      // console.log(updatedEmails);
      this.draftEmails = this.fetchedMailService.getDraftEmails();
    });
  }


}
