import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {competition, competitionclass, event, eventstatus, participant, result, season} from '../interfaces/app.interface';
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
    this.currentseasonObs = this._db.object<season>('/currentdata/currentseason').valueChanges();
    this.currentseasonObs.subscribe(item => {
      if (item !== null) {this.currentseason = item}}
    );

    this.currenteventObs = this._db.object<event>('/currentdata/currentevent').valueChanges();
    this.currenteventObs.subscribe(item => {
      if (item !== null) {
        this.idcurrentevent = item.id
      }
    else {
      this.idcurrentevent = "";
      }
    });

  }

  getseasonOnce() {
    return this._db.object<season>('/currentdata/currentseason').query.once("value");
  }

  getseason(): season {
    return this.currentseason;
  }

  setseason(season: season) {
    this._db.object('/currentdata/currentseason').update(season);
    this.setcashseason(season);
  }

  setcashseason(season: season) {
    this.currentseason = season;
  }

  getEvent() {
    return this._db.object<event>('/currentdata/currentevent').valueChanges();
  }

  setEvent(event: event) {
    if (event.eventStatus == eventstatus.begun) {
      this._db.object('/currentdata/currentevent').update(event);
    }
     else if (event.id == this.idcurrentevent &&
      (event.eventStatus == eventstatus.finish || event.eventStatus == eventstatus.canceled)) {
      this._db.object('/currentdata/currentevent').remove();
    }
  }

  getCompetition() {
    return this._db.object<competition>('/currentdata/currentcompetition').valueChanges();
  }

  setCompetition(competition: competition) {
    this._db.object<competition>('/currentdata/currentcompetition').set(competition)
  }

  getCompetitionClass() {
    return this._db.object<competitionclass>('/currentdata/currentcompetitionclass').valueChanges();
  }

  setCompetitionClass(competitionclass: competitionclass) {
    this._db.object<competitionclass>('/currentdata/currentcompetitionclass').set(competitionclass)
  }

  getCurrentResult1() {
    return this._db.object<result>('/currentdata/currentresult1').valueChanges();
  }

  getCurrentResult2() {
    return this._db.object<result>('/currentdata/currentresult2').valueChanges();
  }

  setCurrentResult1(result: result) {
    this._db.object<result>('/currentdata/currentresult1').set(result);
  }

  setCurrentResult2(result: result) {
    this._db.object<result>('/currentdata/currentresult2').set(result);
  }

  getTurn1() {
    return this._db.list<participant>('/currentdata/currentturn1').valueChanges();
  }

  getTurn2() {
    return this._db.list<participant>('/currentdata/currentturn2').valueChanges();
  }

  setTurn1(participants: participant[]) {
    this._db.list<participant>('/currentdata/currentturn1').remove().then(snapshot =>
      {
        participants.forEach(_participant => {
          this._db.list<participant>('/currentdata/currentturn1/').push(_participant)
        })
      })
  }

  setTurn2(participants: participant[]) {
    this._db.list<participant>('/currentdata/currentturn2').remove().then(snapshot =>
    {
      participants.forEach(_participant => {
        this._db.list<participant>('/currentdata/currentturn2/').push(_participant)
      })
    })
  }

  getCurrentParticipant1() {
    return this._db.object<participant>('/currentdata/currentparticipant1').valueChanges();
  }

  getCurrentParticipant2() {
    return this._db.object<participant>('/currentdata/currentparticipant2').valueChanges();
  }

  setCurrentParticipant1(participant: participant) {
    this._db.object<participant>('/currentdata/currentparticipant1').set(participant);
  }

  setCurrentParticipant2(participant: participant) {
    this._db.object<participant>('/currentdata/currentparticipant2').set(participant);
  }

}
