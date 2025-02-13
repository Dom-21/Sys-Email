import { Component, inject, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RouterOutlet } from '@angular/router';
import { GoogleApiService } from '../shared/google-api.service';
import { EmailDetails, FetchedMailService } from '../shared/fetched-mail.service';

@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [CheckboxModule, ButtonModule, RouterOutlet],
  templateUrl: './mail-list.component.html',
  styleUrl: './mail-list.component.css',
})
export class MailListComponent {

  startIndex: any;
  endIndex: any;
  totalMessages: any;
  currentPage: any;
  previousPage() {
    throw new Error('Method not implemented.');
  }
  totalPages: any;
  nextPage() {
    throw new Error('Method not implemented.');
  }
  onFilterPersonal() {
    throw new Error('Method not implemented.');
  }
  private mailService = inject(FetchedMailService);


  loading: boolean = true;

  constructor(private googleApiService: GoogleApiService) { }

  ngOnInit(): void {
    this.fetchEmails();
  }

  fetchEmails(): void {
    const userId = 'me'; // or dynamically fetched from user data
    this.googleApiService.emails(userId).subscribe(
      (emails: EmailDetails[]) => {
        console.log();
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching emails', error);
        this.loading = false;
      }
    );
  }

  onFilterWork() {
    
  }
  onFilterSocial() {
    
  }
  onFilterPrivate() {
    
  }

}
