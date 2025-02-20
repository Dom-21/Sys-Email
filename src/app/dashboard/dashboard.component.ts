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
  ) {
    
  }

  async ngOnInit(): Promise<void> {
    // if (this.googleApi.isLoggedIn()) {
    //   await this.dashBoardService.fetchAndStoreEmails(); // Fetch emails immediately if logged in
    // }

    // this.fetchedMailService.fetchEmails();
  }

  

}
