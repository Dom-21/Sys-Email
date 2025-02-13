import { Component, inject, Input } from '@angular/core';
import { FormService, Items } from '../../form.service';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-d-html',
  imports: [CdkDrag],
  standalone:true,
  templateUrl: './d-html.component.html',
  styleUrl: './d-html.component.css'
})
export class DHtmlComponent {
  formService = inject(FormService);
            
    @Input() item!: Items;
  
    onClickDelete(item: Items){
      this.formService.delete(item);
    }
}
