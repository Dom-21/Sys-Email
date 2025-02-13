import { Injectable, Signal, signal } from '@angular/core';

export interface Items {
  key: string;
  icon: string;
  group: string;
  id: Signal<string>;
  property: any;
}


@Injectable({
  providedIn: 'root'
})
export class FormService {

  dropped = signal<any[]>([]);
  currentItem = signal<Items | null>(null);
  refreshSignal = signal(0);

  

  constructor() { }


  copyItemInArray<Items>(
    sourceArray: Items[],
    targetArray: Items[],
    sourceIndex: number,
    targetIndex: number
  ): void {
    
    const sourceItem = sourceArray[sourceIndex];
    const newItem: Items = { ...sourceItem, id: this.generateNewId() };
  
   
    targetArray.splice(targetIndex, 0, newItem);
  
    this.dropped.set(targetArray);
  
    // console.log(this.dropped());
  }
  

  private generateNewId(): string {
   
    return `id-${new Date().getTime()}`;
  }
  
  triggerRefresh() {
    this.refreshSignal.set(this.refreshSignal() + 1);
  }

  delete(item: Items) {
    if (confirm("Are you sure you really wanted to delete this item ?")) {
      this.dropped.update((current) => current.filter(i => i.id !== item.id));
      this.currentItem.set(null);
      this.triggerRefresh();

    }
  }

  duplicate(item: Items){
    var newItem = {...item, id:signal(this.generateNewId())};
    
    const currentItems = this.dropped();
    const updatedItems = [...currentItems, newItem];
    this.dropped.set(updatedItems); 
  }

}

export const defaultInputProperty = {
  type: signal('text'),
  name: signal(''),
  value: signal(''),
  label: signal('Input'),
  placeholder: signal(''),
  helper: signal(''),
  class: signal(''),
  width: signal('100'),
  disable: signal(false),
  readonly: signal(false),
  require: signal(false),
  plugin:signal('')
};

export const defaultTextareaProperty = {
  name: signal(''),
  value: signal(''),
  label: signal('Textarea'),
  placeholder: signal(''),
  helper: signal(''),
  class: signal(''),
  width: signal('100'),
  disable: signal(false),
  require: signal(false),
  plugin: signal('')
};

export const defaultSelectProperty = {
  name: signal(''),
  value: signal(''),
  label: signal('Select'),
  placeholder: signal(''),
  helper: signal(''),
  class: signal(''),
  width: signal('100'),
  disable: signal(false),
  multiple: signal(false),
  require: signal(false),
  options: signal([{option:'Option 1', value: 'value 1', group:'', show:true }]),
  plugin:signal('')
};

export const defaultRadioProperty = {
  inline:signal<'Yes'|'No'>('No'),
  center:signal<'Yes' | 'No'>('No'),
  name: signal('radio-1'),
  value: signal<string>('None'),
  label: signal('Radio Group'),
  helper: signal(''),
  class: signal(''),
  width: signal('100'),
  require: signal(false),
  options: signal([{option:'Label-1', value: 'value-1', disable:false, show:true}])
};

export const defaultCheckboxProperty = {
  inline:signal<'Yes'|'No'>('No'),
  center:signal<'Yes' | 'No'>('No'),
  name: signal('check-1'),
  value: signal<string>('None'),
  label: signal('Checkbox Group'),
  helper: signal(''),
  class: signal(''),
  width: signal('100'),
  require: signal(false),
  options: signal([{option:'Label-1', value: 'value-1', disable:false, show:true}])
};

export const defaultFileProperty = {
  name: signal('uploader'),
  label: signal('Upload'),
  helper: signal(''),
  class: signal(''),
  uploader:signal<string>('Default'),
  uploaddir:signal('/file-uploads/'),
  limit: signal(1),
  width: signal('100'),
  extensions: signal(''),
  maxsize: signal('5')  
};

export const defaultHcaptchaProperty = {
  label: signal('Hcaptcha'),
  sitekey: signal(''),
  width: signal('100'),
  center: signal(''),
  secret: signal(''),
  size: signal(''),
  theme: signal(''),
   
};

export const defaultRecaptchaProperty={
  label: signal('Recaptcha'),
  publickey: signal(''),
  privatekey: signal(''),
  width: signal('100'),
}

export const defaultButtonProperty = {
  type: signal<string>('submit'),
  name: signal('button'),
  value: signal(''),
  text: signal('Button'),
  center:signal('Yes'),
  helper: signal(''),
  class: signal('bg-blue-600 border rounded w-32 text-white h-10'),
  width: signal('100'),
  plugin:signal('')
};
export const defaultButtonGroupProperty = [{
  type: signal<string>('Reset'),
  name: signal('button'),
  value: signal(''),
  text: signal('Reset'),
  center:signal('Yes'),
  helper: signal(''),
  class: signal('bg-blue-600 text-white rounded w-32 h-10'),
  width: signal('100'),
  plugin:signal('')
},
{
  type: signal<string>('Submit'),
  name: signal('button'),
  value: signal(''),
  text: signal('Submit'),
  center:signal('Yes'),
  helper: signal(''),
  class: signal('bg-green-600 text-white rounded w-32 h-10'),
  width: signal('100'),
  plugin:signal('')
}];

export const defaultStartConditionProperty = {
  field: signal<string>(''),
  value: signal<string>('')
}

export const defaultTitleProperty = {
  tag: signal<string>('h1'),
  text: signal<string>('My title'),
  class: signal<string>('text-indigo-950'),
}
const temptext = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. At tempora quod quidem expedita placeat cum est iusto doloribus, totam ut reiciendis nulla officia quibusdam consectetur labore non. Corporis, consequuntur adipisci.'
export const defaultParagraphProperty = {
  text: signal<string>(temptext),
  class: signal<string>('text-indigo-950'),
}

const temphtml='<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus eligendi nemo odio accusantium molestias error necessitatibus similique quibusdam dignissimos pariatur ad provident quod, non neque molestiae repellendus reiciendis? Iste, corporis.</p>'

export const defaultHTMLProperty = {
  code: signal<string>(temphtml),
  
}




export const componentList:Items[] = [
  { key: 'Input', icon: '/images/icons/input.png', group: 'input', id: signal<string>('1'), property: defaultInputProperty  },
  { key: 'Textarea', icon: '/images/icons/textarea.png', group: 'input', id: signal<string>('1'), property: defaultTextareaProperty},
  { key: 'Select', icon: '/images/icons/select.png', group: 'input', id: signal<string>('1'), property: defaultSelectProperty },
  { key: 'Radio', icon: '/images/icons/radio.png', group: 'input', id: signal<string>('1'), property: defaultRadioProperty },
  { key: 'Checkbox', icon: '/images/icons/checkbox.png', group: 'input', id: signal<string>('1'), property: defaultCheckboxProperty },

  { key: 'Fileupload', icon: '/images/icons/fileupload.png', group: 'input', id: signal<string>('1'), property: defaultFileProperty },
  { key: 'Hcaptcha', icon: '/images/icons/hcaptcha.png', group: 'input', id: signal<string>('1'), property: defaultHcaptchaProperty },
  { key: 'Recaptcha', icon: '/images/icons/rcaptcha.png', group: 'input', id: signal<string>('1'), property: defaultRecaptchaProperty },
  { key: 'Button', icon: '/images/icons/button.png', group: 'button', id: signal<string>('1'), property: defaultButtonProperty },
  { key: 'Btn group', icon: '/images/icons/buttongroup.png', group: 'button', id: signal<string>('1'), property: defaultButtonGroupProperty },

  { key: 'Start Condition', icon: '/images/icons/condition.png', group: 'condition', id: signal<string>('1'), property: defaultStartConditionProperty },
  { key: 'Find Condition', icon: '/images/icons/condition.png', group: 'condition', id: signal<string>('1'), property: '' },
  { key: 'Title', icon: '/images/icons/title.png', group: 'html', id: signal<string>('1'), property: defaultTitleProperty },
  { key: 'Paragraph', icon: '/images/icons/paragraph.png', group: 'html', id: signal<string>('1'), property: defaultParagraphProperty },
  { key: 'HTML', icon: '/images/icons/html.png', group: 'html', id: signal<string>('1'), property: defaultHTMLProperty },
];





