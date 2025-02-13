import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';

@Component({
  selector: 'app-fileupload',
  standalone:true,
  imports: [TabsModule, FormsModule],
  templateUrl: './fileupload.component.html',
  styleUrl: './fileupload.component.css'
})
export class FileuploadComponent {
  formService = inject(FormService)
  
  options  = ['Default','Image Upload', 'Drag & Drop'];

  class:string = this.formService.currentItem()?.property.class;
  name: string = this.formService.currentItem()?.property.name;
  label: string = this.formService.currentItem()?.property.label;
  helper: string = this.formService.currentItem()?.property.helper;
  uploader: string = this.formService.currentItem()?.property.uploader;
  uploaddir: string = this.formService.currentItem()?.property.uploaddir;
  limit: string = this.formService.currentItem()?.property.limit;
  extensions: string = this.formService.currentItem()?.property.extensions;
  maxsize: string = this.formService.currentItem()?.property.maxsize;
}
