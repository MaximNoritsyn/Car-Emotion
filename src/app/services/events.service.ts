import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {competition, competitionclass, event, participant, point, season} from '../interfaces/app.interface';


export const vocabcompatition = new Map<competition, competitionclass[]>()

@Injectable()
export class EventsService {

  private currentseason: Observable<season>;
  private seasons: Observable<season[]>;
  private currentevent: Observable<event>;
  private events: Observable<event[]>;

  constructor(private _db: AngularFireDatabase,
              private router: Router,
              private _auth: AuthService) {
    this.Prepairvocabluaryclass();
    this.currentseason = this._db.object<season>('/seasons/').valueChanges();
    this.seasons = this._db.list<season>('/seasons/').valueChanges();
    this.currentevent = this._db.object<event>('/events/').valueChanges();
    this.events = this._db.list<event>('/events/').valueChanges();
  }

  getEvets() {
    return this.events
  }

  getSeasons() {
    return this.seasons
  }

  getSeason(id: string) {
    this.currentseason = this._db.object<season>('/seasons/' + id).valueChanges();
    return this.currentseason;
  }

  setSeason(season: season) {
    if (season.id == "") {
      this._db.list('/seasons/').push(season).then((snapshot) => {
        //console.log(snapshot.key);
        this._db.object('/seasons/' + snapshot.key).update({"id": snapshot.key})
      });
    }
    else {
      this._db.object('/seasons/' + season.id).update(season)
    }
  }

  getnewSeason() {
    return new class implements season {
      id: string = "";
      name: string = "";
      date: Date = new Date();
      events: event[];
      points: point[]
    }
  }


  Prepairvocabluaryclass() {
    vocabcompatition.set(
      competition.DecibelLeague,
      [
        competitionclass.beginner750,
        competitionclass.amateur1500,
        competitionclass.specialist3000,
        competitionclass.professional5000,
        competitionclass.extreme,
        competitionclass.sedan4000,
      ]
    );
    vocabcompatition.set(
      competition.DecibelBattle,
      [
        competitionclass._129,
        competitionclass._139
      ]
    );
    vocabcompatition.set(
      competition.DecibelVolume,
      [
        competitionclass.upto150,
        competitionclass.upto250,
        competitionclass.from250
      ]
    );
    vocabcompatition.set(
      competition.DecibelShow,
      [
        competitionclass.Master1500,
        competitionclass.Expert3000,
        competitionclass.Monster
      ]
    );
  }
}
