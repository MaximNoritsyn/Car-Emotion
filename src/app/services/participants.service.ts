import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase} from 'angularfire2/database';
import { AuthService } from '../services/auth.service';

import {car, datacar, participant, person} from '../interfaces/app.interface';
import {EventsService} from './events.service';
import {CurrentdataService} from './currentdata.service';



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
              private _CurrentdataService: CurrentdataService,
              private _auth: AuthService) {
    this._CurrentdataService.getEvent().subscribe(item => {if (item !== null) this.idcurrentevent = item.id})
    this.idcurrentCar = "";
    this.participants = this._db.list<participant>('/participants/' + this.idcurrentevent + '/all').valueChanges();
    this.currentPerson = this._db.object<person>('/persons/').valueChanges();
    this.persons = this._db.list<person>('/persons/').valueChanges();
    this.currentCar = this._db.object<car>('/cars/').valueChanges();
    this.cars = this._db.list<car>('/cars/').valueChanges();
    this.currentdatacar = this._db.object<datacar>('/cars/'+ this.idcurrentCar + '/datacar').valueChanges();
    this.datascar = this._db.list<datacar>('/cars/'+ this.idcurrentCar + '/datacar').valueChanges();
  }

  getParticipants() {
    this.participants = this._db.list<participant>('/participants/' + this.idcurrentevent + '/all').valueChanges();
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
        this.writeCar(_participant)
        }
    else {
      if (_participant.person.datainput <= _participant.datainput) {
        _participant.person.datainput = _participant.datainput;
        this._db.object('/persons/' + _key).update(_participant.person)
      };
      this.writeCar(_participant);
    }

  }

  writeCar(_participant: participant) {
    let _key = _participant.car.id;
    if (_participant.car.model == '') {
      this.writeParticipant(_participant);
    }
    else if (_key == '') {
      _key = this._db.list('/cars/').push(_participant.car).key;
          this._db.object('/cars/' + _key).update({"id": _key});
          _participant.car.id = _key;
          this.writeDataCar(_participant);
          }
    else {
      this._db.object('/cars/' + _key).update(_participant.car);
      this.writeDataCar(_participant);
    }
  }

  writeDataCar(_participant: participant) {
    _participant.datacar.idevent = _participant.idevent;
    let _key = _participant.datacar.id;
    if (_key == '') {
      _key = this._db.list('/cars/' + _participant.car.id + '/datacar/').push(_participant.datacar).key;
          this._db.object('/cars/' + _participant.car.id + '/datacar/' + _key).update({"id": _key});
          _participant.datacar.id = _key;
          this.writeParticipant(_participant);
          }
    else {
      this._db.object('/cars/' + _participant.car.id + '/datacar/' + _key).update(_participant.datacar);
      this.writeParticipant(_participant);
    }
  }

  writeParticipant(_participant: participant) {
    let _key = _participant.id;
    if (_key == "") {
      let _key = this._db.list('/participants/' + this.idcurrentevent + '/all/').push(_participant).key;
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _key).update({"id": _key});
      _participant.id = _key;
    }
    else {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _key).update(_participant);
    }
  }

  getParticipant(id: string) {
    return this._db.object<participant>('/participants/' + this.idcurrentevent + '/all/' + id).valueChanges();
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

  getCars() {
    return this.cars;
  }

  getDataCarOnce(idcar:string) {
    return this._db.list<datacar>('/cars/'+ idcar + '/datacar').query.once("value")
  }

}
