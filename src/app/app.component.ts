import { Component } from '@angular/core';
import construct = Reflect.construct;
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {Translate_Service} from './services/translate.service';
import {CurrentdataService} from './services/currentdata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentlang: string;

  constructor(public authService: AuthService,
              private router: Router,
              private translate_service: Translate_Service,
              private _CurrentdataService: CurrentdataService) { }

  switchLanguage(language: string) {
    this.translate_service.switchLanguage(language);
  }

  getLanguage() {
    this.currentlang = this.translate_service.title;
  }
}


