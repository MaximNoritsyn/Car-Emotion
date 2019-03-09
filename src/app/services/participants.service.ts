import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase} from 'angularfire2/database';
import { AuthService } from '../services/auth.service';

import {car, competitionclass, datacar, participant, person, point, team} from '../interfaces/app.interface';
import {EventsService} from './events.service';



@Injectable()
export class ParticipantsService {

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
    this.participants = this._db.list<participant>('/events/' + this.idcurrentevent + '/participants').valueChanges();
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

  setParticipant(_participant: participant) {
    let localevent = this._EventsService.getEventOnce(this.idcurrentevent);
    localevent.then(item => {
      if (item.val() !== null) {
        _participant.datainput = item.val().startDate;
      this.writePerson(_participant);}
    }
    )
  }

  writePerson(_participant: participant) {
    let _key = _participant.person.id;
    if (_key == '') {
      _participant.person.datainput = _participant.datainput;
        _key = this._db.list('/persons/').push(_participant.person).key;
        this._db.object('/persons/' + _key).update({"id": _key});
        _participant.person.id = _key;
        }
    else {
      if (_participant.person.datainput <= _participant.datainput) {
        _participant.person.datainput = _participant.datainput;
        this._db.object('/persons/' + _key).update(_participant.person)
      };console.log("writePerson not empty");
    }
    this.writeCar(_participant)
  }

  writeCar(_participant: participant) {
    let _key = _participant.car.id;
    if (_key == '') {
      _key = this._db.list('/cars/').push(_participant.car).key;
          this._db.object('/cars/' + _key).update({"id": _key});
          _participant.car.id = _key;
          }
    else {
      this._db.object('/cars/' + _key).update(_participant.car);

    }
    this.writeDataCar(_participant);
  }

  writeDataCar(_participant: participant) {
    _participant.datacar.idevent = _participant.idevent;
    let _key = _participant.datacar.id;
    if (_key == '') {
      _key = this._db.list('/cars/' + _participant.car.id + '/datacar/').push(_participant.datacar).key;
          this._db.object('/cars/' + _participant.car.id + '/datacar/' + _key).update({"id": _key});
          _participant.datacar.id = _key;
          }
    else {
      this._db.object('/cars/' + _participant.car.id + '/datacar/' + _key).update(_participant.datacar);
    }
    this.writeParticipant(_participant);
  }

  writeParticipant(_participant: participant) {
    let _key = _participant.id;
    if (_key == "") {
      let _key = this._db.list('/events/' + this.idcurrentevent + '/competitors/').push(_participant).key;
      this._db.object('/events/' + this.idcurrentevent + '/competitors/' + _key).update({"id": _key});
      _participant.id = _key;
    }
    else {
      this._db.object('/events/' + this.idcurrentevent + '/competitors/' + _key).update(_participant);
    }
  }

  getParticipant(id: string) {
    return this._db.object<participant>('/events/' + this.idcurrentevent + '/competitors/' + id).valueChanges();
  }

  getPersons() {
    return this.persons;
  }

  getPerson(id: string) {
    return this._db.object<person>('/persons/' + id).valueChanges();
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

  getDataCarOnce(idcar:string) {
    return this._db.list<datacar>('/cars/'+ idcar + '/datacar').query.once("value")
  }

}
