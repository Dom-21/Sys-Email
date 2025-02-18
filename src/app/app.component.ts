import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleApiService } from './shared/google-api.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy{
  title = 'my-email-app';

  constructor(){
    
  }

  ngOnDestroy(): void {
      
  }

  
}
