import { Component, inject, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { MailTableComponent } from '../mail-table/mail-table.component';
import { EmailDetails, FetchedMailService } from '../../shared/fetched-mail.service';

@Component({
  selector: 'app-marked-mail',
  standalone: true,
  imports: [CheckboxModule, MailTableComponent],
  templateUrl: './marked-mail.component.html',
  styleUrls: ['./marked-mail.component.css'],
})
export class MarkedMailComponent implements OnInit {

  starredEmails!: EmailDetails[];
  component: string = 'marked';

  constructor(
    private fetchedMailService: FetchedMailService
  ) {}

  ngOnInit(): void {
   

    this.fetchedMailService.loading.set(true);


    setTimeout(() => {
      this.starredEmails = this.fetchedMailService.getMarkedEmails();
      this.fetchedMailService.loading.set(false);
    }, 100);
  }

 
}
