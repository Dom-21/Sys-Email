import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { TabSectionComponent } from "../tabs-section/tabs-section.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';
import { GoogleApiService } from '../shared/google-api.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { FetchedMailService } from '../shared/fetched-mail.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TabSectionComponent, NavBarComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  authService = inject(AuthService);

  constructor(
    
    private googleApiService: GoogleApiService,
    private fetchedMailService: FetchedMailService
  ) {
    this.fetch()
  }

  async ngOnInit(): Promise<void> {
    // if (this.googleApi.isLoggedIn()) {
    //   await this.dashBoardService.fetchAndStoreEmails(); // Fetch emails immediately if logged in
    // }

    // this.fetchedMailService.fetchEmails();
  }

  async fetch(){
    try {
      const url = `https://www.googleapis.com/gmail/v1/users/me/messages?q=in:all`
      const allmails =await firstValueFrom(this.googleApiService.getAllEmails(url));
      
      this.fetchedMailService.extractedEmails = this.fetchedMailService.toEmailsArray(allmails);
  
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  }

}
