import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [TabsModule, FormsModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.css'
})
export class RadioComponent {

  formService = inject(FormService);

    widths = ['33','50','66','100'];
    yesNo = ['Yes', 'No'];
    inline: string = this.formService.currentItem()?.property.inline;
    center: string = this.formService.currentItem()?.property.center;
    name: string = this.formService.currentItem()?.property.name;
    label: string = this.formService.currentItem()?.property.label;
    helper: string = this.formService.currentItem()?.property.helper;
    class: string = this.formService.currentItem()?.property.class;
    width: string = this.formService.currentItem()?.property.width;
    require: boolean = this.formService.currentItem()?.property.require;
    options = this.formService.currentItem()?.property.options;
    value: string = this.formService.currentItem()?.property.value;
    show = true;
  
    onClickAdd() {
      const previousOpt = this.formService.currentItem()?.property.options();
  
      if (previousOpt) {
        
        const updatedOptions = [...previousOpt, { option: 'New Option', value: 'Value', group:'', show: true }];
        this.formService.currentItem()?.property.options.set(updatedOptions);
      }
    }
  
    onClickDelete(opt: any) {
      const previousOpt = this.formService.currentItem()?.property.options();
  
      if (previousOpt) {
        const updatedOptions = previousOpt.filter((o: any) => o !== opt);
        this.formService.currentItem()?.property.options.set(updatedOptions);
      }
    }
  
    toggleShow(opt:any){
      opt.show = !opt.show
    }
  
    showAll(){
      this.show = true;
    }
  
    collapseAll(){
      this.show = false;
    }
}
