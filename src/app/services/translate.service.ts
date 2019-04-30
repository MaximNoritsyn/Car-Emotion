import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class Translate_Service {

  title: string = 'ua';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('ua');
    this.translate.use('ua');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.title = language;
  }

  getLanguage() {
    return this.translate.currentLang;
  }

}
