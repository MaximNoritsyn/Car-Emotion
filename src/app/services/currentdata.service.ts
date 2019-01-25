import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {season} from '../interfaces/app.interface';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class CurrentdataService {

  private idseason: Observable<season>

  constructor(private _db: AngularFireDatabase) {
    this.idseason = this._db.object<season>('/currentseason/maindata').valueChanges();
  }

  getseason() {
    return this.idseason;
  }

  setseason(id: season) {
    this._db.object('/currentseason/maindata').update(id);
  }
}
