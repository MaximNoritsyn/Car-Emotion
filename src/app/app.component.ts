import { Component } from '@angular/core';
import construct = Reflect.construct;
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {Translate_Service} from './services/translate.service';
import {CurrentdataService} from './services/currentdata.service';
import {person} from './interfaces/app.interface';
import {FactoryService} from './services/factory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentlang: string;
  currentperson: person;

  constructor(public _auth: AuthService,
              private router: Router,
              private _FactoryService: FactoryService,
              public translate_service: Translate_Service,
              private _CurrentdataService: CurrentdataService) { }

  ngOnInit() {
    this.currentperson = this._FactoryService.getnewPerson();
     this._auth.getPersonOfCurrentUser().subscribe(
       person => {
         this.currentperson = person
       }
    );
  }

  switchLanguage(language: string) {
    this.translate_service.switchLanguage(language);
  }

  getLanguage() {
    this.currentlang = this.translate_service.title;
  }
}


