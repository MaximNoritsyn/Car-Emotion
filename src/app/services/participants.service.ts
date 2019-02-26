import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase} from 'angularfire2/database';
import { AuthService } from '../services/auth.service';

import {car, competitionclass, datacar, event, participant, person, point, team} from '../interfaces/app.interface';
import {elementStart} from '@angular/core/src/render3';
import {EventsService} from './events.service';



@Injectable()
export class ParticipantsService {

  private currentParticipant: Observable<participant>;
  private participants: Observable<participant[]>;
  private idcurrentevent: string;

  private currentPerson: Observable<person>;
  private persons: Observable<person[]>;


  constructor(private _db: AngularFireDatabase,
              private router: Router,
              private _EventsService: EventsService,
              private _auth: AuthService) {
    this.participants = this._db.list<participant>('/events/' + this.idcurrentevent + '/competitors').valueChanges();
    this.currentParticipant = this._db.object<participant>('/events/' + this.idcurrentevent + '/competitors').valueChanges();
    this.currentPerson = this._db.object<person>('/persons/').valueChanges();
    this.persons = this._db.list<person>('/persons/').valueChanges();
  }

  getParticipants() {
    this.participants = this._db.list<participant>('/events/' + this.idcurrentevent + '/competitors').valueChanges();
    return this.participants
  }

  setParticipant(participant: participant) {
    let localevent = this._EventsService.getEvent(this.idcurrentevent);
    localevent.subscribe(item => {
      participant.datainput = item.startDate;
      this.writePerson(participant);
    })


  }

  writePerson(participant: participant) {
    if (participant.person.id == '') {
      participant.person.datainput = participant.datainput;
      this._db.list('/persons/').push(participant.person).then((snapshot) => {
          this._db.object('/persons/' + snapshot.key).update({"id": snapshot.key});
          participant.person.id = snapshot.key;
          this.writeParticipant(participant)
        }
      )}
    else {
      if (participant.person.datainput <= participant.datainput) {
        participant.person.datainput = participant.datainput;
        this._db.object('/persons/' + participant.person.id).update(participant.person)
      };
      this.writeParticipant(participant);
    }

  }

  writeParticipant(participant: participant) {
    if (participant.id == "") {
      this._db.list('/events/' + this.idcurrentevent + '/competitors/').push(participant).then((snapshot) => {
        this._db.object('/events/' + this.idcurrentevent + '/competitors/' + snapshot.key).update({"id": snapshot.key})
      });
    }
    else {
      this._db.object('/events/' + this.idcurrentevent + '/competitors/' + participant.id).update(participant)
    }

  }

  getParticipant(id: string) {
    this.currentParticipant = this._db.object<participant>('/events/' + this.idcurrentevent + '/competitors/' + id).valueChanges();
    return this.currentParticipant;
  }

  getPersons() {
    return this.persons;
  }

  setidcurrenevent(id: string) {
    this.idcurrentevent = id;
  }

  getnewParticipantclass() {
    let localperson = this.getnewPerson();
    let localidevent = this.idcurrentevent;
    return new class implements participant {
      id: string = "";
      idevent: string = localidevent;
      person: person = localperson;
      imageperson: string = "";
      car: car;
      datacer: datacar;
      team: team;
      isDecibelLeague: boolean = false;
      isDecibelBattle: boolean = false;
      isDecibelVolume: boolean = false;
      isDecibelShow: boolean = false;
      classDecibelLeague: competitionclass;
      classDecibelBattle: competitionclass;
      classDecibelVolume: competitionclass;
      classDecibelShow: competitionclass;
      registered: boolean = false;
      datainput: Date = new Date();
      points: point[]
    }
    }

    getnewPerson() {
      return new class implements person {
        city: string = "";
        email: string = "";
        familyName: string = "";
        id: string = "";
        name: string = "";
        datainput: Date = new Date();
        telephone: string = "";
      }
    }
}
