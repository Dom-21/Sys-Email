import { Component, inject } from '@angular/core';
import { MailTableComponent } from "../mail-table/mail-table.component";

import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';

@Component({
  selector: 'app-archieve',
  standalone: true,
  imports: [MailTableComponent],
  templateUrl: './archieve.component.html',
  styleUrl: './archieve.component.css'
})
export class ArchieveComponent {

  component: string = 'archieve'

  archivedEmails!: EmailDetails[];

  constructor(
    private fetchedMailService: FetchedMailService
  ) {
    // this.fetchedMailService.fetchEmails();
  }

  ngOnInit(): void {

    // this.dashboardService.emails$.subscribe((updatedEmails) => {
    //   // console.log(updatedEmails);
    //   this.archivedEmails =
    //     this.fetchedMailService.getMarkedEmails();
    // });
    this.fetchedMailService.loading.set(true);


    setTimeout(() => {
      this.archivedEmails = this.fetchedMailService.getArchivedEmails();
      this.fetchedMailService.loading.set(false);
    }, 2000);
  }

}
