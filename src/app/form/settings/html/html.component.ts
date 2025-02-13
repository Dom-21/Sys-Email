import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-html',
  standalone:true,
  imports: [TabsModule, FormsModule],
  templateUrl: './html.component.html',
  styleUrl: './html.component.css'
})
export class HtmlComponent {
  formService = inject(FormService);
  
  code: string = this.formService.currentItem()?.property.code;
}
