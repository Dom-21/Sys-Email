import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paragraph',
  standalone:true,
  imports: [TabsModule, FormsModule],
  templateUrl: './paragraph.component.html',
  styleUrl: './paragraph.component.css'
})
export class ParagraphComponent {
  formService = inject(FormService);
  text: string = this.formService.currentItem()?.property.text;
  class: string = this.formService.currentItem()?.property.class;
}
