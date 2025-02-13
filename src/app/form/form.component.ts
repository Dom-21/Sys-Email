import { Component, inject, signal } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from "./settings/settings.component";
import { componentList, FormService } from './form.service';
import { DroppedComponent } from "./dropped/dropped.component";
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

export function copyItemInArray<T>(
  sourceArray: T[],
  targetArray: T[],
  sourceIndex: number,
  targetIndex: number
): void {
  const item = sourceArray[sourceIndex];
  targetArray.splice(targetIndex, 0, item);
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, FormsModule, SettingsComponent, DroppedComponent, RouterLink, RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  formService = inject(FormService);


  components: any[] = componentList;
  dropped = signal<any[]>([]);

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  group: string= 'input';

  constructor(){
    this.dropped = this.formService.dropped;
  }

  getClass(item: any) {
    return item.icon;
  }

  setGroup(item: string){
    this.group = item;
  }

  copyItemInArray<Items>(
    sourceArray: Items[],
    targetArray: Items[],
    sourceIndex: number,
    targetIndex: number
  ): void {
    var item: Items = sourceArray[sourceIndex];
    targetArray.splice(targetIndex, 0, item);
    
    
    this.formService.dropped.set(targetArray);
    
    console.log(this.formService.dropped());
    
    
  }

  drop(event: CdkDragDrop<string[]>) {
    
    if (event.previousContainer === event.container) {
      console.log(this.formService.dropped());
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log(this.formService.dropped());
      
      this.formService.copyItemInArray(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex,
      // );
    }
  }
}










 // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     const data = event.previousContainer.data;
  //     moveItemInArray(data, event.previousIndex, event.currentIndex);
  //   } else {
  //     const data1 = event.previousContainer.data;
  //     const data2 = event.container.data;

  //     copyItemInArray(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }