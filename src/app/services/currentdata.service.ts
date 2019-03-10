import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {event, eventstatus, season} from '../interfaces/app.interface';
import {Observable} from 'rxjs/Rx';
import {FactoryService} from './factory.service';

@Injectable()
export class CurrentdataService {

  private currentseasonObs: Observable<season>;
  private currentseason: season;

  private currenteventObs: Observable<event>;
  private idcurrentevent: string;

  constructor(private _db: AngularFireDatabase,
              private _FactoryService: FactoryService) {
    this.currentseason = this._FactoryService.getnewSeason();
    this.currentseasonObs = this._db.object<season>('/currentseason').valueChanges();
    this.currentseasonObs.subscribe(item => {
      if (item !== null) {this.currentseason = item}}
    );

    this.currenteventObs = this._db.object<event>('/currentevent').valueChanges();
    this.currenteventObs.subscribe(item => {
      if (item !== null) {
        this.idcurrentevent = item.id
      }
    else {
      this.idcurrentevent = "";
      }
    })
  }

  getseasonOnce() {
    return this._db.object<season>('/currentseason').query.once("value");
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

  getevent() {
    return this.currenteventObs;
  }

  setEvent(event: event) {
    if (event.eventStatus == eventstatus.begun) {
      this._db.object('/currentevent').update(event);
    }
     else if (event.id == this.idcurrentevent || event.eventStatus == eventstatus.finish) {
      this._db.object('/currentevent').remove();
    }

  }
}
