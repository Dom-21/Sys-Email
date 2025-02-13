import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { TabSectionComponent } from "../tabs-section/tabs-section.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';
import { GoogleApiService } from '../shared/google-api.service';
import { lastValueFrom } from 'rxjs';
import { DashboardService, Email } from './dashboard.service';

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
    private dashBoardService: DashboardService,
    private googleApi: GoogleApiService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.googleApi.isLoggedIn()) {
      await this.dashBoardService.fetchAndStoreEmails(); // Fetch emails immediately if logged in
    }
  }

  async fetchAndStoreEmails(): Promise<void> {
    if (!this.googleApi.isLoggedIn()) {
      return;
    }

    try {
      const userId = 'me';
      const messages = await lastValueFrom(this.googleApi.emails(userId));

      for (const element of messages.messages) {
        const mail = await lastValueFrom(this.googleApi.getMail(userId, element.id));
        this.dashBoardService.storeEmail(mail);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  }
}
