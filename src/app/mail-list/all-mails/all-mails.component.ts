import { Component, inject, OnInit, signal } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { MailTableComponent } from '../mail-table/mail-table.component';
import { Subscription } from 'rxjs';

import {
  EmailDetails,
  FetchedMailService,
} from '../../shared/fetched-mail.service';


@Component({
  selector: 'app-all-mails',
  standalone: true,
  imports: [CheckboxModule, MailTableComponent],
  templateUrl: './all-mails.component.html',
  styleUrls: ['./all-mails.component.css'],
})
export class AllMailsComponent implements OnInit {

  inboxEmails: any = [];
  component: string = 'inbox';
  subscription: Subscription = new Subscription();
  

  //=====================Variables======================================
  emails: any[] = [];
  inbox: EmailDetails[] = [];
  fetchedMailService = inject(FetchedMailService);


  constructor(){
    // this.fetchedMailService.fetchEmails();
  }
  ngOnInit(): void {
    // this.dashboardService.emails$.subscribe((updatedEmails) => {
    //   // console.log(updatedEmails);
    //   this.fetchedMailService.getInboxEmails();
    // });
    this.fetchedMailService.loading.set(true);
    
    
    setTimeout(() => {
      this.inbox = this.fetchedMailService.getInboxEmails();
      this.fetchedMailService.loading.set(false);
    }, 2000);
  }

}
