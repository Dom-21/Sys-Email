import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [TabsModule, FormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css'
})
export class TextareaComponent {
  formService = inject(FormService);

  widths = ['33', '50', '66', '100'];
  plugins = ['Tinymce',];
  type: string = this.formService.currentItem()?.property.type;
  name: string = this.formService.currentItem()?.property.name;
  value: string = this.formService.currentItem()?.property.value;
  label: string = this.formService.currentItem()?.property.label;
  helper: string = this.formService.currentItem()?.property.helper;
  class: string = this.formService.currentItem()?.property.class;
  width: string = this.formService.currentItem()?.property.width;
  disable: boolean = this.formService.currentItem()?.property.disable;
  require: boolean = this.formService.currentItem()?.property.require;
  plugin: boolean = this.formService.currentItem()?.property.plugin;

}
