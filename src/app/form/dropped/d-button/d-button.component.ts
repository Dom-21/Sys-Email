import { Component, inject, Input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormService, Items } from '../../form.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-d-button',
  standalone:true,
  imports: [FormsModule, CdkDrag],
  templateUrl: './d-button.component.html',
  styleUrl: './d-button.component.css'
})
export class DButtonComponent {
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
    
    isCenter(text: any){
      return text==='Yes' ? 'justify-center' : 'justify-start';
    }
  
    onClickDelete(item: Items) {
      this.formService.delete(item);
    }
}
