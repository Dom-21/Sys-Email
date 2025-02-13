import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { FormsModule, NgModel } from '@angular/forms';
import { FormService } from '../../form.service';

@Component({
  selector: 'app-input',
  standalone:true,
  imports: [TabsModule, SelectModule,FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  formService = inject(FormService);

  types = ['text', 'color', 'date', 'datetime-local', 'email', 'hidden', 'month', 'number', 'password', 'tel', 'time', 'url', 'week'];
  widths = ['33', '50', '66', '100'];
  plugins = ['Autocomplete', 'BootstrapInputSpinner', 'Colorpicker', 'IntlTelInput', 'Litepicker', 'MaterialDatePicker', 'MaterialTimePicker', 'Passfield', 'Pickadate', 'Tooltip' ];
  type:string = this.formService.currentItem()?.property.type;
  name:string = this.formService.currentItem()?.property.name;
  value:string = this.formService.currentItem()?.property.value;
  label:string = this.formService.currentItem()?.property.label;
  helper:string = this.formService.currentItem()?.property.helper;
  class:string = this.formService.currentItem()?.property.class;
  width:string = this.formService.currentItem()?.property.width;
  disable:boolean = this.formService.currentItem()?.property.disable;
  readonly:boolean = this.formService.currentItem()?.property.readonly;
  require:boolean = this.formService.currentItem()?.property.require;
  plugin:boolean = this.formService.currentItem()?.property.plugin;
}
