import { Component, inject, Input } from '@angular/core';
import { FormService, Items } from '../../form.service';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-d-find-condition',
  imports: [CdkDrag],
  standalone:true,
  templateUrl: './d-find-condition.component.html',
  styleUrl: './d-find-condition.component.css'
})
export class DFindConditionComponent {
  formService = inject(FormService);
        
  @Input() item!: Items;

  onClickDelete(item: Items){
    this.formService.delete(item);
  }
}
