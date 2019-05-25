import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from './auth.service';

import {car, competition, competitionclass, datacar, participant, person, point, result} from '../interfaces/app.interface';
import {EventsService} from './events.service';
import {CurrentdataService} from './currentdata.service';
import {FactoryService} from './factory.service';


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
              private _FactoryService: FactoryService) {
    this._CurrentdataService.getEvent().subscribe(item => {if (item !== null) this.idcurrentevent = item.id});
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
      }
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
      this.generatePointsForParticipants(_participant);
    }
    else {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _key).update(_participant);
      this.generatePointsForParticipants(_participant);
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

  generatePointsForParticipants(_participant: participant) {
    if (_participant.registered) {
      if (_participant.isDecibelShow && _participant.pointDecibelShow == undefined) {
        let _point = this._FactoryService.getNewPoint(competition.DecibelShow, _participant.classDecibelShow);
        this.generatePoint(_point, _participant, competition.DecibelShow);
      }

      if (_participant.isDecibelLeague && _participant.pointDecibelLeague == undefined) {
        let _point = this._FactoryService.getNewPoint(competition.DecibelLeague, _participant.classDecibelLeague);
        this.generatePoint(_point, _participant, competition.DecibelLeague);
      }

      if (_participant.isDecibelVolume && _participant.pointDecibelVolume == undefined) {
        let _point = this._FactoryService.getNewPoint(competition.DecibelVolume, _participant.classDecibelVolume);
        this.generatePoint(_point, _participant, competition.DecibelVolume);
      }

      if (_participant.isDecibelBattle && _participant.pointDecibelBattle == undefined) {
        let _point = this._FactoryService.getNewPoint(competition.DecibelBattle, _participant.classDecibelBattle);
        this.generatePoint(_point, _participant, competition.DecibelBattle);
      }

    }
  }

  generatePoint(_point: point, _participant: participant, _competition: competition) {
    _point.idevent = _participant.idevent;
    if (_participant.car == undefined) {
      _point.idcar = "";
    }
    else {
      _point.idcar = _participant.car.id;
    }
    if (_participant.team == undefined) {
      _point.idteam = "";
    }
    else {
      _point.idteam = _participant.team.id;
    }
    if (_participant.person == undefined) {
      _point.idperson = "";
    }
    else {
      _point.idperson = _participant.person.id;
    }

    let _key = this._db.list<point>('/points/').push(_point).key;
    this._db.object<point>('/points/' + _key).update({"id": _key});
    _point.id = _key;
    if (_competition == competition.DecibelShow) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'pointDecibelShow': _point});
    }
    else if (_competition == competition.DecibelLeague) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'pointDecibelLeague': _point});
    }
    else if (_competition == competition.DecibelVolume) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'pointDecibelVolume': _point});
    }
    else if (_competition == competition.DecibelBattle) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'pointDecibelBattle': _point});
    }

  }

  setResult(_result: result, _participant: participant, _class: competitionclass) {

    _result.idparticipant = _participant.id;
    _result.idevent = _participant.idevent;
    _result.class = _class;
    _result.idclass = _class.id;
    if (_participant.car == undefined) {
      _result.idcar = "";
    }
    else {
      _result.idcar = _participant.car.id;
    }
    /*if (_participant.team == undefined) {
      _result.idteam = "";
    }
    else {
      _result.idteam = _participant.team.id;
    }*/
    if (_participant.person == undefined) {
      _result.idperson = "";
    }
    else {
      _result.idperson = _participant.person.id;
    }

    _result.result = 0;
    if (_result.checkin) {
      _result.result = _result.front;
       if (_result.competition == competition.DecibelShow) {
        _result.result = _result.front + _result.sub;
      }
    }

    if (_class.competition == competition.DecibelVolume && _participant.pointDecibelVolume !== undefined) {
      _result.idpoint = _participant.pointDecibelVolume.id
    }
    else if (_class.competition == competition.DecibelBattle && _participant.pointDecibelBattle !== undefined) {
      _result.idpoint = _participant.pointDecibelBattle.id
    }
    else if (_class.competition == competition.DecibelLeague && _participant.pointDecibelLeague !== undefined) {
      _result.idpoint = _participant.pointDecibelLeague.id;
    }
    else if (_class.competition == competition.DecibelShow && _participant.pointDecibelShow !== undefined) {
      _result.idpoint = _participant.pointDecibelShow.id;
    }

    if (_result.id == '') {
      let _key = this._db.list<result>('/results/').push(_result).key;
      this._db.object<result>('/results/' + _key).update({"id": _key}).then(
        snapshot => this.setBestResulttoPoint(_result)
      );

    }
    else {
      this._db.object<result>('/results/' + _result.id).set(_result).then(
        snapshot => this.setBestResulttoPoint(_result)
      );

    }
  }

  setBestResulttoPoint(_result: result): void {
    this._db.list<result>('/results/',
      ref => (ref.orderByChild('idpoint').equalTo(_result.idpoint)
      )
    ).query.once("value").then(items =>
    {
      let bestresult: number = 0;
      items.forEach(datapoint => {
        let curResult = datapoint.val();
        bestresult = Math.max(bestresult, curResult['result']);
        });
      this._db.object('/points/' + _result.idpoint).update({"bestresult": bestresult}).then(item =>
        this._db.object('/points/' + _result.idpoint).update({"idparticipant": _result.idparticipant}).then(
          item => {
            this._db.object('/points/' + _result.idpoint).query.once("value").then(gettenpoint => {
                this.updatePointInParticipant(_result.competition, _result.idevent, _result.idparticipant, gettenpoint.val());
          }
            )})

      );
      this.sortPlacesInPoint(_result.idevent, _result.class);
  })

  }

  sortPlacesInPoint(idevent: string, _class: competitionclass): void {

    this._db.list<point>('/points/',
      ref => (ref.orderByChild('idevent').equalTo(idevent)
      )).query.once("value").then( pointsval =>
      {
        let arrayPoints: point[] = [];
        pointsval.forEach(pointval => {
          let curpoint: point = pointval.val() as point;
          if (curpoint.idclass == _class.id)
            arrayPoints.push(curpoint);
          }
        );

        arrayPoints.sort(this.bestresult);

        let place: number = 1;

        arrayPoints.forEach(item => {
          if (item.bestresult == 0) {
            item.place =  99;
          }
          else {
            item.place = place;
            place++;
          }
          this._db.object('/points/' + item.id).update({"place": item.place});
          if (!(item.idparticipant == '' || item.idparticipant == undefined)) {
            this.updatePointInParticipant(item.competition, item.idevent, item.idparticipant, item);
          }
        })

      }
    )
  }

  updatePointInParticipant(_competition: competition, idevent: string, idparticipant: string, gettenpoint: point) {
    if (_competition == competition.DecibelVolume) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'pointDecibelVolume': gettenpoint});
    }
    else if (_competition == competition.DecibelBattle) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'pointDecibelBattle': gettenpoint});
    }
    else if (_competition == competition.DecibelLeague) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'pointDecibelLeague': gettenpoint});
    }
    else if (_competition == competition.DecibelShow) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'pointDecibelShow': gettenpoint});
    }
  }

  getPointsOfEvent(idevent: string) {
    return this._db.list<point>('/points/',
      ref => (ref.orderByChild('idevent').equalTo(idevent)
      )).valueChanges();
  }

  bestresult( a: point, b: point) {
    if ( a.bestresult > b.bestresult ){
      return -1;
    }
    if ( a.bestresult < b.bestresult ){
      return 1;
    }
    return 0;
  }

}
