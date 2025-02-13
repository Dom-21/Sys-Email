import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import {FormsModule } from '@angular/forms';
import { FormService } from '../../form.service';

@Component({
  selector: 'app-recaptcha',
  standalone:true,
  imports: [TabsModule, FormsModule],
  templateUrl: './recaptcha.component.html',
  styleUrl: './recaptcha.component.css'
})
export class RecaptchaComponent {
  formServices = inject(FormService);

  publickey = this.formServices.currentItem()?.property.publickey;
  privatekey = this.formServices.currentItem()?.property.privatekey;


}
