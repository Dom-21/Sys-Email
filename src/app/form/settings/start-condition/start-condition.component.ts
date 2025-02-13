import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabsClasses, TabsModule } from 'primeng/tabs';
import { FormService } from '../../form.service';

@Component({
  selector: 'app-start-condition',
  standalone: true,
  imports: [TabsModule, FormsModule],
  templateUrl: './start-condition.component.html',
  styleUrl: './start-condition.component.css'
})
export class StartConditionComponent {
   formService = inject(FormService);

   pfield:string = this.formService.currentItem()?.property.field;
   pvalue:string = this.formService.currentItem()?.property.value;
}
