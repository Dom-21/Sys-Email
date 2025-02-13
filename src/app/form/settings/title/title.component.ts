import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [TabsModule, FormsModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent {
  formService = inject(FormService);

  tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  tag: string = this.formService.currentItem()?.property.tag;
  text: string = this.formService.currentItem()?.property.text;
  class: string = this.formService.currentItem()?.property.class;
}
