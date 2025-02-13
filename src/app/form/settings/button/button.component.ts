import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-button',
  standalone:true,
  imports: [TabsModule, FormsModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  formService = inject(FormService);
  
    types = ['submit', 'reset', 'button'];
    yesNo = ['Yes', 'No'];
    widths = ['33', '50', '66', '100'];
    plugins=['Ladda']
    type:string = this.formService.currentItem()?.property.type;
    name:string = this.formService.currentItem()?.property.name;
    value:string = this.formService.currentItem()?.property.value;
    text:string = this.formService.currentItem()?.property.text;
    center:boolean = this.formService.currentItem()?.property.center;
    helper:string = this.formService.currentItem()?.property.helper;
    class:string = this.formService.currentItem()?.property.class;
    width:string = this.formService.currentItem()?.property.width;
    plugin:string = this.formService.currentItem()?.property.plugin;
    
}
