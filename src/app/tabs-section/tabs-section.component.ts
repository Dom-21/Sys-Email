import { Component, inject, OnInit } from '@angular/core';
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

    constructor(private router: Router) {
        this.router.events.subscribe(event => {
              if (event instanceof NavigationEnd) {
                this.currentRoute = event.urlAfterRedirects; // Gets the current active route
              }
            });
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Router',
                icon: 'pi pi-palette',
                items: [
                    {
                        label: 'Installation',
                        icon: 'pi pi-eraser',
                        route: '/installation'
                    },
                    {
                        label: 'Configuration',
                        icon: 'pi pi-heart',
                        route: '/configuration'
                    }
                ]
            },
            {
                label: 'Programmatic',
                icon: 'pi pi-link',
                command: () => {
                    this.router.navigate(['/installation']);
                }
            },
            {
                label: 'External',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Angular',
                        icon: 'pi pi-star',
                        url: 'https://angular.io/'
                    },
                    {
                        label: 'Vite.js',
                        icon: 'pi pi-bookmark',
                        url: 'https://vitejs.dev/'
                    }
                ]
            }
        ];
    }

    isActive(route: string): boolean {
        return this.currentRoute === route;
      }

    showMore = false;

    toggleShowMore(){
        this.showMore = !this.showMore;
    }

    onClickMarked(){
           // Update the inboxMessages signal
    }
    

}