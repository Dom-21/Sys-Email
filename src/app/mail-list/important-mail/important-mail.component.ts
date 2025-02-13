import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { MailTableComponent } from '../mail-table/mail-table.component';
import { DashboardService } from '../../dashboard/dashboard.service';
import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';

@Component({
  selector: 'app-important-mail',
  standalone: true,
  imports: [CheckboxModule, MailTableComponent],
  templateUrl: './important-mail.component.html',
  styleUrl: './important-mail.component.css',
})
export class ImportantMailComponent {

  component: string = 'important';
  importantEmails: EmailDetails[] = [];

  constructor(
    private dashboardService: DashboardService,
    private fetchedMailService: FetchedMailService
  ) {}

  ngOnInit(): void {
    this.dashboardService.emails$.subscribe((updatedEmails) => {
      // console.log(updatedEmails);
      this.importantEmails = this.fetchedMailService.getImportantEmails();
    });
  }

}
