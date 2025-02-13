import { Component, inject, Input } from '@angular/core';
import { FormService, Items } from '../../form.service';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-d-hcaptcha',
  imports: [CdkDrag],
  standalone:true,
  templateUrl: './d-hcaptcha.component.html',
  styleUrl: './d-hcaptcha.component.css'
})
export class DHcaptchaComponent {

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

      getTheme(theme: any) {
        return theme==='Dark' ? 'bg-gray-500' : 'bg-slate-50';
      }
}
