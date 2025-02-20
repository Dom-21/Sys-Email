import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FetchedMailService } from '../shared/fetched-mail.service';

@Component({
    selector: 'app-tabs-section',
    templateUrl: './tabs-section.component.html',
    styleUrls: ['./tabs-section.component.css'],
    standalone: true,
    imports:  [CommonModule, CardModule, RouterLink, RouterModule],
    providers: [MessageService]
})
export class TabSectionComponent implements OnInit {
    items!: MenuItem[];
    

    private fetchMailService = inject(FetchedMailService);
    inboxLength = this.fetchMailService.inboxLength;
    draftsLength = this.fetchMailService.draftsLength;
    currentRoute: string = '';
    tabs = [
        { icon:'pi-inbox', text:'Inbox', link:'/dashboard/inbox'},
        { icon:'pi-star-fill', text:'Starred', link:'/dashboard/inbox/mails/marked'},
        { icon:'pi-send', text:'Sent', link:'/dashboard/inbox/mails/sent'},
        { icon:'pi-exclamation-circle', text:'Spam', link:'/dashboard/inbox/mails/spam'},
        { icon:'pi-file-o', text:'Draft', link:'/dashboard/inbox/mails/drafts'},
        { icon:'pi-trash', text:'Trash', link:'/dashboard/inbox/mails/trash'},
        { icon:'pi-bookmark-fill', text:'Important', link:'/dashboard/inbox/mails/important'},
        { icon:'pi-warehouse', text:'Archieve', link:'/dashboard/inbox/mails/archieve'},
    ]

    constructor(private router: Router) {
        
    }

    ngOnInit() {
       
    }

    isActive(route: string): boolean {
        return this.currentRoute === route;
      }

    showMore = false;

    toggleShowMore(){
        this.showMore = !this.showMore;
    }


    onClick(text: string){
        this.fetchMailService.loading.set(true);
        this.fetchMailService.load.set(text.toLowerCase());
        this.fetchMailService.getMails(text.toLowerCase());
        this.router.navigate(['/dashboard/inbox/mails/general']);
    }

    

}