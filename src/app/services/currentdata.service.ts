import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {season} from '../interfaces/app.interface';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class CurrentdataService {

  private idseason: Observable<string>

  constructor(private _db: AngularFireDatabase) {
    this.idseason = this._db.object<string>('/currentseason/').valueChanges();
  }

  getseason() {
    return this.idseason;
  }

  setseason(id: season) {
    this._db.list('/currentseason/').push(id).then((snapshot) => {
      //console.log(snapshot.key);
      //this._db.object('/currentseason/' + snapshot.key).update({"id": snapshot.key})
    });
  }
}
