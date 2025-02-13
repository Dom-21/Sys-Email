import { Component, inject, Input, signal, Signal } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormService, Items } from '../../form.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-d-input',
  imports: [CdkDrag, FormsModule],
  standalone: true,
  templateUrl: './d-input.component.html',
  styleUrl: './d-input.component.css'
})
export class DInputComponent {
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
