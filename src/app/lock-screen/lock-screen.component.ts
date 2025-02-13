import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lock-screen',
  standalone:true,
  imports: [ FormsModule ],
  templateUrl: './lock-screen.component.html',
  styleUrl: './lock-screen.component.css'
})
export class LockScreenComponent {
  message = '';
  password = '';
  user = {
    name:"Omkar Dandavate",
    email:"olepenco@gmail.com",
  }
  data: any;

  constructor(private location: Location, private http: HttpClient){}

  goBack() {
    this.location.back();
  }

  unlock(){
    if(this.password === "Omkar@123"){
      this.goBack();
    }else if(this.password.length < 6){
      this.message = "Too short password the length should be at least 6 characters."
    }else if(this.password.length < "Omkar@123".length){
      this.message = '';
    }
    else{
      this.message = "Incorrect password. Please, try again!"
    }
    this.fetchData();
  }

  fetchData() {
    this.http.get('https://jsonplaceholder.typicode.com/posts')
      .subscribe(response => {
        this.data = response;
        // console.log('API Response:', response);
      });
  }
}
