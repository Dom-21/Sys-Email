import { Component, inject, Input } from '@angular/core';
import { FormService, Items } from '../../form.service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-d-fileupload',
  imports: [FormsModule, CdkDrag],
  standalone:true,
  templateUrl: './d-fileupload.component.html',
  styleUrl: './d-fileupload.component.css'
})
export class DFileuploadComponent {
  formService = inject(FormService);
  
    @Input() item!: Items;
  
    getWidth(num:any){
      switch(num){
        case '33' : 
                return 'w-1/3';
        case '50': 
                return 'w-1/2';
        case '66': 
                return 'w-2/3';
        case '100': 
                return 'w-full';
        default: 
                return 'w-1/2';
      }
    }
  
    onClickDelete(item: Items) {
      this.formService.delete(item);
    }
}
