import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ FormsModule, ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
 
  @Output() close = new EventEmitter<void>();
  userName: string = 'Omkar Dandavate';
  userEmail: string = 'olepenco@gmail.com';
  userPhone: string = '(886) 199 2133'
  birthDate: string = '2001-12-21';
  userGender: string= 'Male';
  userAddress: string = 'WeWork Prestige Atlanta, Koramangala, Bangalore, Karnataka - 560034';

  summary: string = `<strong>💻 Frontend Developer | UI Engineer | Angular Enthusiast</strong><br>

Passionate and detail-oriented Frontend Developer with expertise in Angular, TypeScript, HTML, CSS, Tailwind CSS, and PrimeNG. Adept at building responsive, high-performance web applications with a strong focus on user experience and clean code architecture.`;
  edit:boolean =  false;


  onCancel() {
    this.edit = false;
  }

  onClose(){
    this.close.emit();
  }

  onEdit(){
    this.edit = !this.edit
  }

}
