import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase} from 'angularfire2/database';
import { AuthService } from '../services/auth.service';

import {car, competitionclass, datacar, participant, person, point, team} from '../interfaces/app.interface';
import {EventsService} from './events.service';



@Injectable()
export class ParticipantsService {

  private currentParticipant: Observable<participant>;
  private participants: Observable<participant[]>;
  private idcurrentevent: string;

  private currentPerson: Observable<person>;
  private persons: Observable<person[]>;

  private currentCar: Observable<car>;
  private cars: Observable<car[]>;
  private idcurrentCar: string;

  private currentdatacar: Observable<datacar>;
  private datascar: Observable<datacar[]>;


  constructor(private _db: AngularFireDatabase,
              private router: Router,
              private _EventsService: EventsService,
              private _auth: AuthService) {
    this.idcurrentCar = "";
    this.participants = this._db.list<participant>('/events/' + this.idcurrentevent + '/competitors').valueChanges();
    this.currentParticipant = this._db.object<participant>('/events/' + this.idcurrentevent + '/competitors').valueChanges();
    this.currentPerson = this._db.object<person>('/persons/').valueChanges();
    this.persons = this._db.list<person>('/persons/').valueChanges();
    this.currentCar = this._db.object<car>('/cars/').valueChanges();
    this.cars = this._db.list<car>('/cars/').valueChanges();
    this.currentdatacar = this._db.object<datacar>('/cars/'+ this.idcurrentCar + '/datacar').valueChanges();
    this.datascar = this._db.list<datacar>('/cars/'+ this.idcurrentCar + '/datacar').valueChanges();
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
          this.writeCar(participant)
        }
      )}
    else {
      if (participant.person.datainput <= participant.datainput) {
        participant.person.datainput = participant.datainput;
        this._db.object('/persons/' + participant.person.id).update(participant.person)
      };
      this.writeCar(participant);
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
    let _person = this.getnewPerson();
    let _idevent = this.idcurrentevent;
    let _car = this.getnewCar();
    let _datacar = this.getnewDataCar();
    return new class implements participant {
      id: string = "";
      idevent: string = _idevent;
      person: person = _person;
      imageperson: string = "";
      car: car = _car;
      datacar: datacar = _datacar;
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

  getnewCar() {
    return new class implements car {
      id: string = "";
      model: string = "";
      alternateName: string = ""
    }
  }

  getnewDataCar() {
    return new class implements datacar {
      id: string = "";
      idevent: string = "";
      image: string = "";
      subsize: number = 0;
      subcount: number = 0;
      nameamplifiler: string = "";
      front: string = "";
      datainput: Date = new Date()
    }
  }

  getCars() {
    return this.cars;
  }

  writeDataCar(participant: participant) {
    if (participant.datacar.id == '') {
      this._db.list('/cars/' + participant.car.id + '/datacar/').push(participant.datacar).then((snapshot) => {
          this._db.object('/cars/' + participant.car.id + '/datacar/' + snapshot.key).update({"id": snapshot.key});
          participant.datacar.id = snapshot.key;
          this.writeParticipant(participant)
        }
      )}
    else {
      this._db.object('/cars/' + participant.car.id + '/datacar/' + participant.datacar.id).update(participant.datacar);
      this.writeParticipant(participant);
    }
  }

  writeCar(participant: participant) {
    if (participant.car.id == '') {
      this._db.list('/cars/').push(participant.person).then((snapshot) => {
          this._db.object('/cars/' + snapshot.key).update({"id": snapshot.key});
          participant.car.id = snapshot.key;
          this.writeDataCar(participant)
        }
      )}
    else {
      this.writeDataCar(participant);
    }

  }
}
