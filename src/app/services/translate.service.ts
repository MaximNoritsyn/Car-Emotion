import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class Translate_Service {

  title: string = 'ua'

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('ua');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.title = language;
  }

  getLanguage(language: string) {
    return this.translate.currentLang;
  }

}
