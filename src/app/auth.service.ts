import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from './shared/google-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:3000/login'; // Mock API

  constructor(private http: HttpClient, private router: Router, private googleApiService : GoogleApiService) {}

  private user = '';
  private password = '';

  setUser(value: string): void {
    this.user = value;
  }

  // Setter for password
  setPassword(value: string): void {
    this.password = value;
  }

  // Optional: Getter methods if you want to access these private properties
  getUser(): string {
    return this.user;
  }

  getPassword(): string {
    return this.password;
  }


  private authenticated = false;

  // Simulating authentication (for demo purposes)
  authenticateUser() {
    this.authenticated = true;
  }


  logoutUser() {
    this.googleApiService.signOut();
  }
  


  

  login(credentials: { email: string; password: string }) {
    if (credentials.email === 'olepenco@gmail.com' && credentials.password === 'Omkar@123') {
     
      const token = 'hello-omkar';  
      localStorage.setItem('loginId', credentials.email);  
      localStorage.setItem('token', token); 
      this.authenticated = true;  
      console.log('Logged in successfully!');
      this.router.navigate(['/dashboard']);
      
    } else {
      alert('Invalid credentials!');
    }
  }
  
  checkLoginStatus() {
    if(this.googleApiService.isLoggedIn()){
      this.googleApiService.signIn();
      
      alert("Auto-Login Succesful");
    }
    
  }
  onTestApi() {
    this.http.get('http://localhost:3000/protectedData').subscribe(
      (response) => {
        console.log('Protected API Response:', response);
      },
      (error) => {
        console.error('API Call Failed!', error);
      }
    );
  }
}
