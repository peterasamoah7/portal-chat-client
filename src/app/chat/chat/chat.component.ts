import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatMessage } from 'src/models/ChatMessage';
import { TranslateRequest } from 'src/models/TranslateRequest';
import { TranslateViewModel } from 'src/models/TranslateViewModel';
import { SignalrService } from 'src/services/signalr.service';
import { TranslationService } from 'src/services/translation.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  user: string;
  lang: any;
  chatForm: FormGroup; 
  messages: Array<ChatMessage> = []; 

  constructor(
    private route : ActivatedRoute,
    private signalrService: SignalrService, 
    private translationService: TranslationService) { }

  ngOnInit(): void {
    this.initChatForm();
    this.signalrService.init(); 

    this.signalrService.messageReceived
      .subscribe((message: ChatMessage) => {
        this.handleMessage(message);
    });

    this.route.params
      .subscribe(s => this.user = s.id);

    this.route.queryParamMap
      .subscribe(p => {
        this.lang = p.get('lang');
      });
  }

  initChatForm(){
    this.chatForm = new FormGroup({
      'message': new FormControl('', [Validators.required])
    });
  }

  handleMessage(message: ChatMessage){
    if(message.lang === this.lang){
      this.messages.push(message);
      return; 
    }

    var req = new TranslateRequest();
    req.to = this.lang;
    req.text = message.text; 

    this.translationService.translate(req)
      .subscribe(t => {
        message.text = t.text;
        message.lang = t.from;
        this.messages.push(message);
      }, () => {
        console.log('Translation failed')
      })
  }

  sendMessage(){
    let m = this.chatForm.get('message')?.value;
    var msg = new ChatMessage(m, this.user, this.lang);
    this.signalrService.send(msg); 
  }
}
