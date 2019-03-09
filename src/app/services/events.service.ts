import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {competition, competitionclass, event, eventstatus, participant, season, team} from '../interfaces/app.interface';


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
  private currentteam: Observable<team>;
  private competitionclassObs: Observable<competitionclass>;
  private competitionclassesObs: Observable<competitionclass[]>;

  constructor(private _db: AngularFireDatabase,
              private router: Router,
              private _auth: AuthService) {
    this.currentseason = this._db.object<season>('/seasons/').valueChanges();
    this.seasons = this._db.list<season>('/seasons/').valueChanges();
    this.currentteam = this._db.object<team>('/seasons/0/teams/').valueChanges();
    this.currentevent = this._db.object<event>('/events/').valueChanges();
    this.events = this._db.list<event>('/events/').valueChanges();
    this.competitionclassObs = this._db.object<competitionclass>('/competitionclass/').valueChanges();
    this.competitionclassesObs = this._db.list<competitionclass>('/competitionclass/').valueChanges();
  }

  getEvets() {
    return this.events;
  }

  getEvent(id: string) {
    this.currentevent = this._db.object<event>('/events/' + id).valueChanges();
    return this.currentevent;
  }

  getEventOnce(id: string) {
    return this._db.object<event>('/events/' + id).query.once("value");
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
      startDate: Date = new Date()
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

  getNewTeam() {
    return new class implements team {
      id: string = "";
      legalName: string = "";
      logo: string = ""
    }
  }

  getCompetitionClasses(classes: competitionclass[], localcompetition: competition): competitionclass[] {
    return classes.filter(option => option.competition == localcompetition && option.actual == true)
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

  getTeam(idseason: string, id:string) {
    this.currentteam = this._db.object<team>('/seasons/' + idseason + '/teams/' + id).valueChanges();
    return this.currentteam;
  }

  getTeams(idseason: string) {
    return this._db.list<team>('/seasons/' + idseason + '/teams/').valueChanges();
  }

  setTeam(idseason: string, _team:team) {
    if (_team.id == "") {
      this._db.list('/seasons/' + idseason + '/teams/').push(_team).then((snapshot) => {
        this._db.object('/seasons/' + idseason + '/teams/' + snapshot.key).update({"id": snapshot.key})
      });
    }
    else {
      this._db.object('/seasons/' + idseason + '/teams/' + _team.id).update(_team)
    }
  }
}
