import { Component, inject, signal } from '@angular/core';
import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';
import { MailTableComponent } from "../mail-table/mail-table.component";

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [MailTableComponent],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export class GeneralComponent {
  fetchedMailService = inject(FetchedMailService);
  currentMails = this.fetchedMailService.currentMails;
  component = this.fetchedMailService.component();
  constructor(){
    
    
    
  }

  ngOnInit(): void {
    
    
    // setTimeout(() => {
    //   this.fetchedMailService.currentMails.set(this.fetchedMailService.getInboxEmails());
    // }, 3000);
  }
}
