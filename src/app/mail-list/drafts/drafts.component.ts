import { Component, inject } from '@angular/core';
import { MailTableComponent } from '../mail-table/mail-table.component';

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
  
    private fetchedMailService: FetchedMailService
  ) {
    // fetchedMailService.fetchEmails();
  }

  ngOnInit(): void {
    
    this.fetchedMailService.loading.set(true);


    setTimeout(() => {
      this.draftEmails = this.fetchedMailService.getDraftEmails();
      this.fetchedMailService.loading.set(false);
    }, 2000);
  }


}
