import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { MailTableComponent } from '../mail-table/mail-table.component';
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

    private fetchedMailService: FetchedMailService
  ) {
    // fetchedMailService.fetchEmails();
  }

  ngOnInit(): void {
   
    this.fetchedMailService.loading.set(true);


    setTimeout(() => {
      this.importantEmails = this.fetchedMailService.getImportantEmails();
      this.fetchedMailService.loading.set(false);
    }, 1000);
  }

}
