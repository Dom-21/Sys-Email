import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [TabsModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
  formService = inject(FormService);

  widths = ['33', '50', '66', '100'];
  plugins = ['BootstrapSelect', 'Select2', 'Slimselect'];
  type: string = this.formService.currentItem()?.property.type;
  name: string = this.formService.currentItem()?.property.name;
  value: string = this.formService.currentItem()?.property.value;
  label: string = this.formService.currentItem()?.property.label;
  helper: string = this.formService.currentItem()?.property.helper;
  class: string = this.formService.currentItem()?.property.class;
  width: string = this.formService.currentItem()?.property.width;
  disable: boolean = this.formService.currentItem()?.property.disable;
  multiple: boolean = this.formService.currentItem()?.property.multiple;
  require: boolean = this.formService.currentItem()?.property.require;
  options = this.formService.currentItem()?.property.options;
  plugin: string = this.formService.currentItem()?.property.plugin;
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
