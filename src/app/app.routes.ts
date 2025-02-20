import { Routes } from '@angular/router';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TasksComponent } from './tasks/tasks.component';
import { ReplyComponent } from './reply/reply.component';
import { ForwardComponent } from './forward/forward.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { MailComponent } from './mail/mail.component';
import { MailDraftComponent } from './mail-draft/mail-draft.component';
import { InboxComponent } from './inbox/inbox.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { GeneralComponent } from './mail-list/general/general.component';
import { FormComponent } from './form/form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'lock', component: LockScreenComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo:'inbox', pathMatch:'full' },
      { path: 'tasks', component: TasksComponent },
      { path: 'reply', component: ReplyComponent },
      { path: 'forward', component: ForwardComponent },
      { path: 'new-message', component: NewMessageComponent },
      { path: 'mail', component: MailComponent },
      { path: 'mail-draft', component: MailDraftComponent },
      {
        path: 'inbox',
        component: InboxComponent,
        children: [
          { path:'', redirectTo:'mails', pathMatch:'full' },
          { 
            path: 'mails',
            component: MailListComponent,
            children: [
              { path:'', redirectTo:'general', pathMatch:'full' },
              { path: 'general', component: GeneralComponent },
            ]
          }
        ]
      },
    ]
  },
  { path: 'form-builder', component: FormComponent },
  { path: 'login', component: LoginComponent },
];
