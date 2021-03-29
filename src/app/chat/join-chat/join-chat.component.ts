import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageViewModel } from 'src/models/LanguageViewModel';
import { TranslationService } from 'src/services/translation.service';

@Component({
  selector: 'app-join-chat',
  templateUrl: './join-chat.component.html',
  styleUrls: ['./join-chat.component.scss']
})
export class JoinChatComponent implements OnInit {

  joinForm: FormGroup;
  languages: Array<LanguageViewModel> = [];
  defaultLang: any;
  loading: boolean = false;

  constructor(
    private router: Router,
    private translationService: TranslationService) { }

  ngOnInit(): void {
    this.initLangList();
    this.initJoinForm();
  }

  initJoinForm(){
    this.joinForm = new FormGroup({
      'name': new FormControl(`user${Math.random()}`, [Validators.minLength(2)]),
      'lang': new FormControl(this.defaultLang, [Validators.required])
    });
  }

  initLangList(){
    this.loading = true;
    this.translationService.languages().subscribe(l => {
      this.languages = l;
      this.defaultLang = this.languages.find(x => x.name == 'English');
      this.loading = false;
    }, () => console.log('Api call failed'));
  }

  joinChat(){
    if(!this.joinForm.valid){
      return;
    }

    let n = this.joinForm.get('name')?.value;
    let l = this.joinForm.get('lang')?.value.prefix;
    console.log(l);

    this.router.navigate([`chat/${n}`], { queryParams: { lang : l} })
  }
}
