import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {season} from '../interfaces/app.interface';
import {Observable} from 'rxjs/Rx';
import {EventsService} from './events.service';

@Injectable()
export class CurrentdataService {

  private currentseasonObs: Observable<season>;
  private currentseason: season;

  constructor(private _db: AngularFireDatabase,
              private _EventsService: EventsService) {
    this.currentseason = this._EventsService.getnewSeason();
    this.currentseasonObs = this._db.object<season>('/currentseason').valueChanges();
    this.currentseasonObs.subscribe(item => {
      if (item !== null) {this.currentseason = item}}
    )
  }

  getseason(): season {
    return this.currentseason;
  }

  setseason(season: season) {
    this._db.object('/currentseason').update(season);
    this.setcashseason(season);
  }

  setcashseason(season: season) {
    this.currentseason = season;
  }
}
