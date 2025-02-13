import { Component, inject, Input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormService, Items } from '../../form.service';

@Component({
  selector: 'app-d-paragraph',
  imports: [CdkDrag],
  standalone:true,
  templateUrl: './d-paragraph.component.html',
  styleUrl: './d-paragraph.component.css'
})
export class DParagraphComponent {
  formService = inject(FormService);
              
      @Input() item!: Items;
    
      onClickDelete(item: Items){
        this.formService.delete(item);
      }
}
