import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {competition, competitionclass, event, eventstatus, participant, season} from '../interfaces/app.interface';


export const arraystatuses: eventstatus[] = [];
arraystatuses.push(eventstatus.inplan);
arraystatuses.push(eventstatus.begun);
arraystatuses.push(eventstatus.finish);
arraystatuses.push(eventstatus.canceled);

export const arraycompetition: competition[] = [];
arraycompetition.push(competition.DecibelBattle);
arraycompetition.push(competition.DecibelLeague);
arraycompetition.push(competition.DecibelShow);
arraycompetition.push(competition.DecibelVolume);

@Injectable()
export class EventsService {

  private currentseason: Observable<season>;
  private seasons: Observable<season[]>;
  private currentevent: Observable<event>;
  private events: Observable<event[]>;
  private competitionclassObs: Observable<competitionclass>;
  private competitionclassesObs: Observable<competitionclass[]>;
  private competitionclassArray: competitionclass[];

  constructor(private _db: AngularFireDatabase,
              private router: Router,
              private _auth: AuthService) {
    this.competitionclassArray = [];
    this.currentseason = this._db.object<season>('/seasons/').valueChanges();
    this.seasons = this._db.list<season>('/seasons/').valueChanges();
    this.currentevent = this._db.object<event>('/events/').valueChanges();
    this.events = this._db.list<event>('/events/').valueChanges();
    this.competitionclassObs = this._db.object<competitionclass>('/competitionclass/').valueChanges();
    this.competitionclassesObs = this._db.list<competitionclass>('/competitionclass/').valueChanges();
    this.competitionclassesObs.subscribe(items => this.competitionclassArray = items.filter(option => option.actual = true))
  }

  getEvets() {
    return this.events;
  }

  getEvent(id: string) {
    this.currentevent = this._db.object<event>('/events/' + id).valueChanges();
    return this.currentevent;
  }

  setEvent(event: event) {
    if (event.id == "") {
      this._db.list('/events/').push(event).then((snapshot) => {
        this._db.object('/events/' + snapshot.key).update({"id": snapshot.key})
      });
    } else {
      this._db.object('/events/' + event.id).update(event)
    }
  }

  getSeasons() {
    return this.seasons
  }

  getSeason(id: string) {
    this.currentseason = this._db.object<season>('/seasons/' + id).valueChanges();
    return this.currentseason;
  }

  setSeason(season: season): void {
    if (season.id == "") {
      this._db.list('/seasons/').push(season).then((snapshot) => {
        this._db.object('/seasons/' + snapshot.key).update({"id": snapshot.key})
      });
    }
    else {
      this._db.object('/seasons/' + season.id).update(season)
    }
  }

  getnewSeason(): season {
    return new class implements season {
      id: string = "";
      name: string = "";
      date: Date = new Date()
    }
  }

  getnewEvent(): event {
    return new class implements event {
      id: string = "";
      name: string = "";
      season: season = new class implements season {
        id: string = "";
        name: string = "";
        date: Date = new Date()
      };
      location: string = "";
      eventStatus: eventstatus = eventstatus.inplan;
      organizer: string = "Car Emotion";
      startDate: Date = new Date();
      competitors: participant[]
    }
  }

  getNewCompetitionClass() {
    return new class implements competitionclass {
      id: string = "";
      competition: competition;
      name: string = "";
      actual: boolean = false;
      comment: string = ""
    }
  }

  getCompetitionClasses(classes: competitionclass[], localcompetition: competition): competitionclass[] {
    return classes.filter(option => option.competition == localcompetition)
  }

  getCompetitionClassesObs() {
    return this.competitionclassesObs;
  }

  getCompetitionClassObs(idclass: string) {
    this.competitionclassObs = this._db.object<competitionclass>('/competitionclass/' + idclass).valueChanges();
    return this.competitionclassObs
  }

  setCompetitionClass(localClass: competitionclass) {

    if (localClass.id == "") {
      this._db.list('/competitionclass/').push(localClass).then((snapshot) => {
        this._db.object('/competitionclass/' + snapshot.key).update({"id": snapshot.key})
      });
    }
    else {
      this._db.object('/competitionclass/' + localClass.id).update(localClass)
    }
  }

}
