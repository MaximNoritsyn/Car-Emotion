import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {competition, competitionclass, event, participant, season, team} from '../interfaces/app.interface';
import {CurrentdataService} from './currentdata.service';

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
              private _CurrentdataService: CurrentdataService,
              private _auth: AuthService) {
    this.currentseason = this._db.object<season>('/seasons/').valueChanges();
    this.seasons = this._db.list<season>('/seasons/').valueChanges();
    this.currentteam = this._db.object<team>('/seasons/0/teams/').valueChanges();
    this.currentevent = this._db.object<event>('/events/').valueChanges();
    this.events = this._db.list<event>('/events/').valueChanges();
    this.competitionclassObs = this._db.object<competitionclass>('/competitionclass/').valueChanges();
    this.competitionclassesObs = this._db.list<competitionclass>('/competitionclass/').valueChanges();
  }

  getEvents() {
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
        this._db.object('/events/' + snapshot.key).update({"id": snapshot.key});
        event.id = snapshot.key;
        this._CurrentdataService.setEvent(snapshot);
      });
    } else {
      this._db.object('/events/' + event.id).update(event);
      this._CurrentdataService.setEvent(event);
    }
  }

  updateEvent(event: event) {
    if (event.id !== "") {
      let _list = this._db.list<participant>('/participants/' + event.id).query.once('value').then(
        resultparticipants => {
          event.countDecibelLeague = 0;
          event.countDecibelVolume = 0;
          event.countDecibelShow = 0;
          event.bestDecibelLeague = 0;
          event.bestDecibelVolume = 0;
          event.bestDecibelShow = 0;
          resultparticipants.forEach(_participant => {
              let curparticipant: participant = _participant.val() as participant;
              if (curparticipant.isDecibelLeague == true) {
                event.countDecibelLeague == event.countDecibelLeague + 1;
                event.bestDecibelLeague == Math.max(event.bestDecibelLeague, curparticipant.resultDecibelLeague.result);
              }
            if (curparticipant.isDecibelVolume == true) {
              event.countDecibelVolume == event.countDecibelVolume + 1;
              event.bestDecibelVolume == Math.max(event.bestDecibelVolume, curparticipant.resultDecibelVolume.result)
            }
            if (curparticipant.isDecibelShow == true) {
              event.countDecibelShow == event.countDecibelShow + 1;
              event.bestDecibelShow == Math.max(event.bestDecibelShow, curparticipant.resultDecibelShow.result)
            }
            }
          );

          this._db.object('/events/' + event.id).update(event);

        }
      );
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

  getCompetitionClasses(classes: competitionclass[], localcompetition: competition): competitionclass[] {
    if (classes !== undefined) {
      return classes.filter(option => option.competition == localcompetition && option.actual == true)
    }
    return []
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
    return this._db.object<team>('/teams/' + idseason + '/list/' + id).valueChanges();
  }

  getTeams(idseason: string) {
    return this._db.list<team>('/teams/' + idseason + '/list/').valueChanges();
  }

  setTeam(idseason: string, _team:team) {
    if (_team.id == "") {
      this._db.list('/teams/' + idseason + '/list/').push(_team).then((snapshot) => {
        this._db.object('/teams/' + idseason + '/list/' + snapshot.key).update({"id": snapshot.key})
      });
    }
    else {
      this._db.object('/teams/' + idseason + '/list/' + _team.id).update(_team)
    }
  }
}
