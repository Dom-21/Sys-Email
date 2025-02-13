import { Component, inject } from '@angular/core';
import { MailTableComponent } from "../mail-table/mail-table.component";
import { DashboardService } from '../../dashboard/dashboard.service';
import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';

@Component({
  selector: 'app-archieve',
  standalone: true,
  imports: [MailTableComponent],
  templateUrl: './archieve.component.html',
  styleUrl: './archieve.component.css'
})
export class ArchieveComponent {

  component : string = 'archieve'
 
  archivedEmails!: EmailDetails[];

  constructor(
      private dashboardService: DashboardService,
      private fetchedMailService: FetchedMailService
    ) {}
  
    ngOnInit(): void {
     
      this.dashboardService.emails$.subscribe((updatedEmails) => {
        // console.log(updatedEmails);
        this.archivedEmails =
          this.fetchedMailService.getMarkedEmails();
      });
    }

}
