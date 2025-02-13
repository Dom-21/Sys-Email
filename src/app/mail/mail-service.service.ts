import { Injectable } from '@angular/core';
import { GoogleApiService, UserInfo } from '../shared/google-api.service';
import { EmailDetails } from '../shared/fetched-mail.service';





@Injectable({
  providedIn: 'root',
})
export class MailService {
  private _message!: EmailDetails;
  mailSnippets: string[] = []
  userInfo?: UserInfo
  private _component: string = '';


  

  constructor(private googleApi : GoogleApiService) {
    
  }

  public get component(): string {
    return this._component;
  }
  public set component(value: string) {
    this._component = value;
  }

  setMessage(message: any) {
    this._message = message;
  }

  getMessage() {
    return this._message;
  }

  
}
