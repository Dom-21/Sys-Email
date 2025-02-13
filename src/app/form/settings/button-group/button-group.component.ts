import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-button-group',
  standalone: true,
  imports: [TabsModule, FormsModule],
  templateUrl: './button-group.component.html',
  styleUrl: './button-group.component.css'
})
export class ButtonGroupComponent {
  formService = inject(FormService);
  button1 = true;
  button2 = true;

  types = ['submit', 'reset', 'button'];
  yesNo = ['Yes', 'No'];
  widths = ['33', '50', '66', '100'];
  plugins = ['Ladda',];
  type: string = this.formService.currentItem()?.property[0].type;
  name: string = this.formService.currentItem()?.property[0].name;
  value: string = this.formService.currentItem()?.property[0].value;
  text: string = this.formService.currentItem()?.property[0].text();
  center: boolean = this.formService.currentItem()?.property[0].center;
  helper: string = this.formService.currentItem()?.property[0].helper;
  class: string = this.formService.currentItem()?.property[0].class;
  width: string = this.formService.currentItem()?.property[0].width;
  plugin: string = this.formService.currentItem()?.property[0].plugin;
  
  type1: string = this.formService.currentItem()?.property[1].type;
  name1: string = this.formService.currentItem()?.property[1].name;
  value1: string = this.formService.currentItem()?.property[1].value;
  text1: string = this.formService.currentItem()?.property[1].text();
  center1: boolean = this.formService.currentItem()?.property[1].center;
  helper1: string = this.formService.currentItem()?.property[1].helper;
  class1: string = this.formService.currentItem()?.property[1].class;
  width1: string = this.formService.currentItem()?.property[1].width;
  plugin1: string = this.formService.currentItem()?.property[1].plugin;

  toggleButton1()
  {
    this.button1 = !this.button1;
  }
  toggleButton2()
  {
    this.button2 = !this.button2;
  }
}
