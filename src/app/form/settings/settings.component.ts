import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { InputComponent } from "./input/input.component";
import { FormService } from '../form.service';
import { TextareaComponent } from "./textarea/textarea.component";
import { SelectComponent } from "./select/select.component";
import { RadioComponent } from "./radio/radio.component";
import { CheckboxComponent } from "./checkbox/checkbox.component";
import { FileuploadComponent } from "./fileupload/fileupload.component";
import { HcaptchaComponent } from "./hcaptcha/hcaptcha.component";
import { RecaptchaComponent } from "./recaptcha/recaptcha.component";
import { ButtonComponent } from "./button/button.component";
import { ButtonGroupComponent } from "./button-group/button-group.component";
import { StartConditionComponent } from "./start-condition/start-condition.component";
import { FindConditionComponent } from "./find-condition/find-condition.component";
import { TitleComponent } from "./title/title.component";
import { ParagraphComponent } from "./paragraph/paragraph.component";
import { HtmlComponent } from "./html/html.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TabsModule, InputComponent, TextareaComponent, SelectComponent, RadioComponent, CheckboxComponent, FileuploadComponent, HcaptchaComponent, RecaptchaComponent, ButtonComponent, ButtonGroupComponent, StartConditionComponent, FindConditionComponent, TitleComponent, ParagraphComponent, HtmlComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  formService = inject(FormService);

  selectedItem = this.formService.currentItem;

  constructor(){
    effect(() => {
      this.formService.refreshSignal();
      this.refresh();
    });
  }

  refresh() {
    // console.log("Component A refreshed!");
    this.selectedItem.set(null);
  }
}
