import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'primeng/popover';
import { DatePicker } from 'primeng/datepicker';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { ProfileComponent } from "../profile/profile.component";
import { AuthService } from '../auth.service';
import { GoogleApiService } from '../shared/google-api.service';

@Component({
  selector: 'app-nav-bar',
  standalone:true,
  imports: [
    CalendarModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    CommonModule,
    PopoverModule,
    DatePicker,
    RouterLink,
    RouterModule,
    ProfileComponent
],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {

  isDarkMode = false;
  toggledProfile = false;
  popOver = false;
  searchBar = false;
  navMenu = false;
  profile = false;
  date: Date[] | undefined;
  user: any;
  currentRoute: string = '';


  @ViewChild('calenderPopover') calenderPopover!: ElementRef;

  constructor(private eRef: ElementRef, private router: Router, private authService: AuthService, private googleApi: GoogleApiService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects; // Gets the current active route
      }
    });
  }

  ngOnInit() {

    this.user = {
      name: 'Omkar Dandavate',
      email: 'olepenco@gmail.com',
    };


  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  toggle() {
    this.popOver = !this.popOver;
  }

  toggleNavMenu() {
    this.navMenu = !this.navMenu;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleSearchBar() {
    this.searchBar = !this.searchBar;
  }

  toggleProfile() {
    this.toggledProfile = !this.toggledProfile;
  }

  profilePopover() {
    this.profile = !this.profile;
    this.popOver = false;
  }

  onCloseProfile(){
    this.profile = false;
  }

  onClickSignOut(){
    this.popOver = false;
    this.authService.logoutUser();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    // Check if the click is outside the component
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.popOver = false; // Close the popover
      this.showDropdown = false;
      this.toggledProfile = false;
      this.searchBar = false;
      this.navMenu = false;
      this.profile = false;
    }
  }

  dateValue!: Date;

  countries = [
    { name: 'United States', flag: 'https://flagcdn.com/us.svg' },
    { name: 'India', flag: 'https://flagcdn.com/in.svg' },
    { name: 'Germany', flag: 'https://flagcdn.com/de.svg' },
    { name: 'Japan', flag: 'https://flagcdn.com/jp.svg' },
    { name: 'France', flag: 'https://flagcdn.com/fr.svg' },
    { name: 'Canada', flag: 'https://flagcdn.com/ca.svg' },
    { name: 'Australia', flag: 'https://flagcdn.com/au.svg' },
  ];

  showDropdown = false; // To toggle dropdown visibility
  selectedCountry: { name: string; flag: string } | null = null; // To store selected country

  // Toggle dropdown
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // Select country and close dropdown
  selectCountry(country: { name: string; flag: string }) {
    this.selectedCountry = country;
    this.showDropdown = false;
  }

  onClickOutside(event: Event): void {
    if (
      this.popOver &&
      this.calenderPopover &&
      !this.calenderPopover.nativeElement.contains(event.target)
    ) {
      this.popOver = false;
    }
  }
}
