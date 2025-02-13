import { Component, inject, Input, signal } from '@angular/core';
import { FormService, Items } from '../form.service';
import { DInputComponent } from "./d-input/d-input.component";
import { DTextareaComponent } from "./d-textarea/d-textarea.component";
import { DSelectComponent } from "./d-select/d-select.component";
import { DRadioComponent } from "./d-radio/d-radio.component";
import { DCheckboxComponent } from "./d-checkbox/d-checkbox.component";
import { DFileuploadComponent } from "./d-fileupload/d-fileupload.component";
import { DHcaptchaComponent } from './d-hcaptcha/d-hcaptcha.component';
import { DRecaptchaComponent } from "./d-recaptcha/d-recaptcha.component";
import { DButtonComponent } from "./d-button/d-button.component";
import { DButtonGroupComponent } from "./d-button-group/d-button-group.component";
import { DStartConditionComponent } from "./d-start-condition/d-start-condition.component";
import { DFindConditionComponent } from "./d-find-condition/d-find-condition.component";
import { DParagraphComponent } from "./d-paragraph/d-paragraph.component";
import { DHtmlComponent } from "./d-html/d-html.component";
import { DTitleComponent } from "./d-title/d-title.component";

@Component({
  selector: 'app-dropped',
  standalone: true,
  imports: [DInputComponent, DTextareaComponent, DSelectComponent, DRadioComponent, DCheckboxComponent, DFileuploadComponent, DHcaptchaComponent, DRecaptchaComponent, DButtonComponent, DButtonGroupComponent, DStartConditionComponent, DFindConditionComponent, DParagraphComponent, DHtmlComponent, DTitleComponent],
  templateUrl: './dropped.component.html',
  styleUrl: './dropped.component.css'
})
export class DroppedComponent {

  formService = inject(FormService);

  dropped = this.formService.dropped


  onClickDelete(item: any){
    this.formService.delete(item);
  }

  onSelect(item: any) {
    const selectedItem = this.dropped().find(i => i.id === item.id);
  
    if (selectedItem) {
      this.formService.currentItem.set(selectedItem);
    } else {
      // console.warn('Item with ID not found:', item.id);
    }
  }
  
  

  onCtrlClick(event: any, item: Items) {
    if(event.ctrlKey){
      this.formService.duplicate(item);
    }
  }
}
