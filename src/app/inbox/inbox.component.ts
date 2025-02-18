import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Router, RouterOutlet } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TabSectionComponent } from "../tabs-section/tabs-section.component";
import { FetchedMailService } from '../shared/fetched-mail.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MailTableComponent } from "../mail-list/mail-table/mail-table.component";
import { GoogleApiService } from '../shared/google-api.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CheckboxModule, ButtonModule, RouterOutlet, ReactiveFormsModule, CommonModule, TabSectionComponent, ScrollPanelModule, MailTableComponent],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent implements OnInit {
  checked: any;
  popOverMenu = false;
  popOverType = false;
  searchBar = false;
  tabs = false;

  reload = new EventEmitter();


  searchControl = new FormControl('');
  filteredMessages: any[] = []; // To store filtered messages
  popoverPosition = { top: 0, left: 0 }; // Dynamic position of the popover
  @ViewChild('button', { static: true }) button!: ElementRef;
  @ViewChild('popoverContainer') popoverContainer!: ElementRef;
  @ViewChild('popoverMenu') popoverMenu!: ElementRef;
  @ViewChild('tabsMenu') tabsMenu!: ElementRef;

  filteredEmails: any;




  constructor(private fetchedMailService: FetchedMailService, private googleApiService: GoogleApiService) {
  
  }

  

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe(searchTerm => {
      this.fetchedMailService.currentMails.set((this.fetchedMailService.searchMessages(searchTerm || '')));
    });


  }
  onClickReload() {
    this.fetchedMailService.reloadCurrentRoute();
  }

  onToggleTabs() {
    this.tabs = !this.tabs;
  }

  toggleMenu() {
    this.popOverMenu = !this.popOverMenu;
  }

  toggleSearchBar() {
    this.searchBar = !this.searchBar;
  }

  toggleType(): void {
    this.popOverType = !this.popOverType;

    if (this.popOverType) {
      // Calculate button position
      const buttonRect = this.button.nativeElement.getBoundingClientRect();
      this.popoverPosition = {
        top: buttonRect.bottom + window.scrollY + 10, // Position just below the button
        left: buttonRect.left + window.scrollX, // Align with the button's left edge
      };
    }

  }


  trashSelectedEmails() {
    if(this.fetchedMailService.selectedMessages.length===0){
      this.fetchedMailService.showMessage("Please select message(s)");
      return;
    }
    this.fetchedMailService.trashSelectedEmails().subscribe(
      (updatedEmails) => {
        // alert("Email(s) moved to trash");
        this.fetchedMailService.showMessage('Email(s) moved to trash');
        this.onClickReload();
      },
      (error) => {
        console.error('Error moving emails to trash:', error);
      }
    );
  }

  onClickUnread() {
    if(this.fetchedMailService.selectedMessages.length===0){
      this.fetchedMailService.showMessage("Please select message(s)");
      return;
    }
    this.fetchedMailService.markSelectedAsUnread().subscribe({
      next: () => {
        // alert('Email(s) marked as unread');
        this.fetchedMailService.showMessage('Email(s) marked as unread');
        this.fetchedMailService.reloadCurrentRoute();
      },
      error: (err) => console.error('Error marking emails as read', err)
    });
  }

  onClickRead() {
    if(this.fetchedMailService.selectedMessages.length===0){
      this.fetchedMailService.showMessage("Please select message(s)");
      return;
    }
    this.fetchedMailService.markSelectedAsRead().subscribe({
      next: () => {
        // alert('Email(s) marked as read');
        this.fetchedMailService.showMessage('Email(s) marked as read');
        this.fetchedMailService.reloadCurrentRoute();
      },
      error: (err) => console.error('Error marking emails as read', err)
    });
  }

  onClickSpam() {
    if(this.fetchedMailService.selectedMessages.length===0){
      this.fetchedMailService.showMessage("Please select message(s)");
      return;
    }
    this.fetchedMailService.markSelectedAsSpam().subscribe({
      next: () => {
        // alert('Email(s) marked as spam');
        this.fetchedMailService.showMessage('Email(s) moved to spam');
        this.fetchedMailService.reloadCurrentRoute();
      },
      error: (err) => console.error('Error marking emails as read', err)
    });
  }
  
  onClickArchieve() {
    if(this.fetchedMailService.selectedMessages.length===0){
      this.fetchedMailService.showMessage("Please select message(s)");
      return;
    }
    this.fetchedMailService.markSelectedAsSpam().subscribe({
      next: () => {
        // alert('Email(s) marked as archieve');
        this.fetchedMailService.showMessage('Email(s) moved to archieve');
        this.fetchedMailService.reloadCurrentRoute();
      },
      error: (err) => console.error('Error marking emails as read', err)
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (
      this.popOverType &&
      this.popoverContainer &&
      !this.popoverContainer.nativeElement.contains(event.target)
    ) {
      this.popOverType = false;
    }
    if (
      this.popOverMenu &&
      this.popoverMenu &&
      !this.popoverMenu.nativeElement.contains(event.target)
    ) {
      this.popOverMenu = false;
    }
    if (this.tabs && this.tabsMenu && !this.tabsMenu.nativeElement.contains(event.target)) {
      this.tabs = false;
    }


  }
}
