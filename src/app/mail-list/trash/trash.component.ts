import { Component, inject } from '@angular/core';
import { MailTableComponent } from '../mail-table/mail-table.component';

import { message, trash } from '../../shared/messages';
import { DashboardService } from '../../dashboard/dashboard.service';
import { GoogleApiService } from '../../shared/google-api.service';
import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [MailTableComponent],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.css',
})
export class TrashComponent {
 
  trashEmails!: EmailDetails[];
  component: string = 'trash';

  constructor(
    private dashboardService: DashboardService,
    private fetchedEmailService: FetchedMailService
  ) {}

  ngOnInit(): void {
    this.dashboardService.emails$.subscribe((updatedEmails) => {
      this.trashEmails = this.fetchedEmailService.getTrashEmails();
    });
  }

 

  toggleMarked(obj: EmailDetails): void {
    
  }

  toggleImportant(obj: EmailDetails): void {
    
  }

  get currentPage() {
   return
  }

  get itemsPerPage() {
    return 
  }

  get totalMessages() {
    return 
  }

  get startIndex() {
    return 
  }

  get endIndex() {
    return 
  }

  nextPage(): void {
    
  }

  previousPage(): void {
    
  }
}
