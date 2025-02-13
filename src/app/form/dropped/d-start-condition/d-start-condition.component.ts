import { Component, inject, Input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormService, Items } from '../../form.service';

@Component({
  selector: 'app-d-start-condition',
  imports: [CdkDrag],
  standalone:true,
  templateUrl: './d-start-condition.component.html',
  styleUrl: './d-start-condition.component.css'
})
export class DStartConditionComponent {
  formService = inject(FormService);
      
  @Input() item!: Items;

  onClickDelete(item: Items){
    this.formService.delete(item);
  }
}
