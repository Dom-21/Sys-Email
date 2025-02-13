import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { NewMessageComponent } from './new-message/new-message.component';
import { InboxComponent } from './inbox/inbox.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { AllMailsComponent } from './mail-list/all-mails/all-mails.component';
import { MarkedMailComponent } from './mail-list/marked-mail/marked-mail.component';
import { ImportantMailComponent } from './mail-list/important-mail/important-mail.component';
import { DraftsComponent } from './mail-list/drafts/drafts.component';
import { SentComponent } from './mail-list/sent/sent.component';
import { TrashComponent } from './mail-list/trash/trash.component';
import { SpamComponent } from './mail-list/spam/spam.component';
import { ArchieveComponent } from './mail-list/archieve/archieve.component';
import { TasksComponent } from './tasks/tasks.component';
import { MailComponent } from './mail/mail.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { LoginComponent } from './login/login.component';
import { ReplyComponent } from './reply/reply.component';
import { ForwardComponent } from './forward/forward.component';
import { FormComponent } from './form/form.component';
import { MailDraftComponent } from './mail-draft/mail-draft.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'lock', component: LockScreenComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo:'inbox', pathMatch:'full'},
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
          
            {path:'', redirectTo:'mails', pathMatch:'full'},
            {path: 'mails',
            component: MailListComponent,
            children: [
              {path:'', redirectTo:'all', pathMatch:'full'},
              { path: 'all', component: AllMailsComponent },
              { path: 'archieve', component: ArchieveComponent },
              { path: 'marked', component: MarkedMailComponent },
              { path: 'important', component: ImportantMailComponent },
              { path: 'drafts', component: DraftsComponent },
              { path: 'sent', component: SentComponent },
              { path: 'trash', component: TrashComponent },
              { path: 'spam', component: SpamComponent },
            ]
            }
          
        ],
      },
    ],
  },
  { path:'form-builder', component: FormComponent},
  { path: 'login', component: LoginComponent, },
 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
