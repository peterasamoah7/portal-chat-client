import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinChatComponent } from './join-chat/join-chat.component';
import { ChatComponent } from './chat/chat.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes : Routes = [
  {
    path : 'join',
    component: JoinChatComponent
  },
  {
    path: ':id',
    component : ChatComponent
  }
]

@NgModule({
  declarations: [
    JoinChatComponent, 
    ChatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ChatModule { }
