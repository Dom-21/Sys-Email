import { Component, inject, Input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormService, Items } from '../../form.service';
@Component({
  selector: 'app-d-title',
  imports: [ CdkDrag ],
  standalone:true,
  templateUrl: './d-title.component.html',
  styleUrl: './d-title.component.css'
})
export class DTitleComponent {
  formService = inject(FormService);
          
  @Input() item!: Items;

  onClickDelete(item: Items){
    this.formService.delete(item);
  }
}
