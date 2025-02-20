import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RouterOutlet } from '@angular/router';
import { GoogleApiService } from '../shared/google-api.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { EmailDetails, FetchedMailService } from '../shared/fetched-mail.service';
import { MailTableComponent } from "./mail-table/mail-table.component";


@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [CheckboxModule, ButtonModule, RouterOutlet, ScrollPanelModule],
  templateUrl: './mail-list.component.html',
  styleUrl: './mail-list.component.css',
})
export class MailListComponent {

  filterMails:EmailDetails[] = [];
  
  
  private fetchedMailService = inject(FetchedMailService);

  @ViewChild('filterContainer') filterContainer!: ElementRef;
  loading: boolean = true;
  filter = false;
  component='';
  constructor(private googleApiService: GoogleApiService) { }

  ngOnInit(){
    this.filter = false;
  }

  onFilter(label:string) {
    this.fetchedMailService.currentMails.set(this.fetchedMailService.extractedEmails.filter((email: EmailDetails) => 
      email.labels.includes(label)
    ));
  }
  @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {
      if (
        this.filter &&
        this.filterContainer &&
        !this.filterContainer.nativeElement.contains(event.target)
      ) {
        this.filter = false;
      }
    }

}
