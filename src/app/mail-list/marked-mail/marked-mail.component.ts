import { Component, inject, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { MailTableComponent } from '../mail-table/mail-table.component';
import { DashboardService } from '../../dashboard/dashboard.service';
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
    private dashboardService: DashboardService,
    private fetchedMailService: FetchedMailService
  ) {}

  ngOnInit(): void {
   
    this.dashboardService.emails$.subscribe((updatedEmails) => {
      // console.log(updatedEmails);
      this.starredEmails =
        this.fetchedMailService.getMarkedEmails();
    });
  }

 
}
