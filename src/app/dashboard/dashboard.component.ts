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
  standalone:true,
  imports: [TabSectionComponent, NavBarComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  authService = inject(AuthService);

  isAuthenticated = false;
  emailSubscription: any;
  userInfo: any;

  constructor(private dashBoardService: DashboardService,
    private googleApi: GoogleApiService,
  ){
    if(googleApi.isLoggedIn()){
      googleApi.userProfileSubject.subscribe( info => {
        this.userInfo = info
        if (this.userInfo) {
          this.fetchAndStoreEmails(); // Call getEmails() after authentication
        }
      })
    }
  }

  ngOnInit(): void {
   
     


    if(this.googleApi.isLoggedIn()){
      this.fetchAndStoreEmails();

      // interval(10000).subscribe(() => {
      //   this.fetchAndStoreEmails();
      // });//execute 30s after
    }
  }

  async fetchAndStoreEmails() {
    if (!this.googleApi.isLoggedIn()) {
      return;
    }

    const userId = 'me';
    const messages = await lastValueFrom(this.googleApi.emails(userId));
    const emailList: Email[] = [];

    for (const element of messages.messages) {
      const mail = await lastValueFrom(this.googleApi.getMail(userId, element.id));
      
      this.dashBoardService.storeEmail(mail);
    }

    // this.dashBoardService.storeEmails(emailList); 
  }

  
  }

