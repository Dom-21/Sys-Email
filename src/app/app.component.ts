import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleApiService } from './shared/google-api.service';
import { firstValueFrom } from 'rxjs';
import { FetchedMailService } from './shared/fetched-mail.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy{
  title = 'my-email-app';

  constructor(private googleApiService: GoogleApiService,
    private fetchedMailService: FetchedMailService){
    this.fetchedMailService.getMails('inbox');
    this.fetch();
  }

  ngOnDestroy(): void {
      
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
