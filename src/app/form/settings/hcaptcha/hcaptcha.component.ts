import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';

@Component({
  selector: 'app-hcaptcha',
  standalone:true,
  imports: [TabsModule, FormsModule],
  templateUrl: './hcaptcha.component.html',
  styleUrl: './hcaptcha.component.css'
})
export class HcaptchaComponent {
  formServices = inject(FormService);

  themes=['Light', 'Dark'];
  yesNo = ['Yes', 'No'];
  sizes = ['Normal', 'Compact'];

  sitekey = this.formServices.currentItem()?.property.sitekey;
  secret = this.formServices.currentItem()?.property.secret;
  center = this.formServices.currentItem()?.property.center;
  size = this.formServices.currentItem()?.property.size;
  theme = this.formServices.currentItem()?.property.theme;


}
