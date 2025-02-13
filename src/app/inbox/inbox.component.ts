import { Component, ElementRef, EventEmitter, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Router, RouterOutlet } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TabSectionComponent } from "../tabs-section/tabs-section.component";
import { FetchedMailService } from '../shared/fetched-mail.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CheckboxModule, ButtonModule, RouterOutlet, ReactiveFormsModule, CommonModule, TabSectionComponent],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent implements OnInit, OnDestroy {
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
  emailSubscription!: Subscription;




  constructor(private eRef: ElementRef, private fetchedMailService: FetchedMailService, private router: Router) {

  }


  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for the user to stop typing for 300ms
        distinctUntilChanged() // Only trigger if the value actually changes
      )
      .subscribe((searchTerm) => {
        if (searchTerm) {
          // Perform the search if searchTerm is not null and has at least 3 characters
          this.fetchedMailService.searchMessages(searchTerm);
        }
      });

  }
  onClickReload() {
    this.fetchedMailService.reloadCurrentRoute();
  }


  ngOnDestroy(): void {
    if (this.emailSubscription) {
      console.log(this.emailSubscription);
      this.emailSubscription.unsubscribe();
    }
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
    this.fetchedMailService.trashSelectedEmails().subscribe(
      (updatedEmails) => {
        console.log('Emails moved to trash:', updatedEmails);
        this.onClickReload();
      },
      (error) => {
        console.error('Error moving emails to trash:', error);
      }
    );
  }

  onClickUnread() {
    this.fetchedMailService.markSelectedAsUnread().subscribe({
      next: () => console.log('Selected emails marked as unread'),
      error: (err) => console.error('Error marking emails as read', err)
    });
  }

  onClickRead() {
    this.fetchedMailService.markSelectedAsRead().subscribe({
      next: () => console.log('Selected emails marked as read'),
      error: (err) => console.error('Error marking emails as read', err)
    });
  }

  onClickSpam() {
    this.fetchedMailService.markSelectedAsSpam().subscribe({
      next: () => console.log('Selected emails marked as spam'),
      error: (err) => console.error('Error marking emails as read', err)
    });
  }
  
  onClickArchieve() {
    this.fetchedMailService.markSelectedAsSpam().subscribe({
      next: () => console.log('Selected emails moved to archieve'),
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
    if (this.tabs && !this.tabsMenu.nativeElement.contains(event.target)) {
      this.tabs = false;
    }


  }
}
