import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from './auth.service';

import {car, competition, competitionclass, datacar, participant, person, result} from '../interfaces/app.interface';
import {EventsService} from './events.service';
import {CurrentdataService} from './currentdata.service';
import {FactoryService} from './factory.service';
import {elementDef} from '@angular/core/src/view';


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
        //this.writeCar(_participant)
        this.writeParticipant(_participant);
        }
    else {
      if (_participant.person.datainput <= _participant.datainput) {
        _participant.person.datainput = _participant.datainput;
        this._db.object('/persons/' + _key).update(_participant.person)
      }
      //this.writeCar(_participant);
      this.writeParticipant(_participant);
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
      this.generateResultsForParticipants(_participant);
    }
    else {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _key).update(_participant);
      this.generateResultsForParticipants(_participant);
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

  generateResultsForParticipants(_participant: participant) {
    if (_participant.registered) {
      if (_participant.isDecibelShow && _participant.resultDecibelShow == undefined) {
        let _result = this._FactoryService.getNewResult(competition.DecibelShow, _participant.classDecibelShow);
        this.generateResult(_result, _participant, competition.DecibelShow);
      }

      if (_participant.isDecibelLeague && _participant.resultDecibelLeague == undefined) {
        let _result = this._FactoryService.getNewResult(competition.DecibelLeague, _participant.classDecibelLeague);
        this.generateResult(_result, _participant, competition.DecibelLeague);
      }

      if (_participant.isDecibelVolume && _participant.resultDecibelVolume == undefined) {
        let _result = this._FactoryService.getNewResult(competition.DecibelVolume, _participant.classDecibelVolume);
        this.generateResult(_result, _participant, competition.DecibelVolume);
      }

      if (_participant.isDecibelBattle && _participant.resultDecibelBattle == undefined) {
        let _result = this._FactoryService.getNewResult(competition.DecibelBattleQualy, _participant.classDecibelBattle);
        this.generateResult(_result, _participant, competition.DecibelBattleQualy);
      }
    }
    else {
      if (_participant.resultDecibelShow !== undefined) {
        this.deleteResult(_participant.resultDecibelShow, _participant);
      }

      if (_participant.resultDecibelLeague !== undefined) {
        this.deleteResult(_participant.resultDecibelLeague, _participant);
      }

      if (_participant.resultDecibelVolume !== undefined) {
        this.deleteResult(_participant.resultDecibelVolume, _participant);
      }

      if (_participant.resultDecibelBattle !== undefined) {
        this.deleteResult(_participant.resultDecibelBattle, _participant);
      }
    }
  }

  generateResult(_result: result, _participant: participant, _competition: competition) {
    _result.idevent = _participant.idevent;
    _result.competition = _competition;
    if (_participant.car == undefined) {
      _result.idcar = "";
    }
    else {
      _result.idcar = _participant.car.id;
    }
    if (_participant.team == undefined) {
      _result.idteam = "";
    }
    else {
      _result.idteam = _participant.team.id;
      _result.team = _participant.team;
    }

    if (_participant.person == undefined) {
      _result.idperson = "";
    }
    else {
      _result.idperson = _participant.person.id;
      _result.person = _participant.person;
    }

    if (_competition == competition.DecibelShow) {
      _result.class = _participant.classDecibelShow;
      if (_participant.resultDecibelShow !== undefined && _participant.resultDecibelShow.id !== "") {
        _result.id = _participant.resultDecibelShow.id;
      }
    }
    else if (_competition == competition.DecibelLeague) {
      _result.class = _participant.classDecibelLeague;
      if (_participant.resultDecibelLeague !== undefined && _participant.resultDecibelLeague.id !== "") {
        _result.id = _participant.resultDecibelLeague.id;
      }
    }
    else if (_competition == competition.DecibelVolume) {
      _result.class = _participant.classDecibelVolume;
      if (_participant.resultDecibelVolume !== undefined && _participant.resultDecibelVolume.id !== "") {
        _result.id = _participant.resultDecibelVolume.id;
      }
    }
    else if (_competition == competition.DecibelBattleQualy) {
      _result.class = _participant.classDecibelBattle;
      if (_participant.resultDecibelBattle !== undefined && _participant.resultDecibelBattle.id !== "") {
        _result.id = _participant.resultDecibelBattle.id;
      }
    }

    if (_result.class !== undefined) {
      _result.idclass = _result.class.id;
    }
    else
    {
      _result.idclass = "";
    }

    _result.idparticipant = _participant.id;


    if (_result.id == "") {
      let _key = this._db.list<result>('/results/').push(_result).key;
      this._db.object<result>('/results/' + _key).update({"id": _key});
      _result.id = _key;
    }
    else {
      this._db.object<result>('/results/' + _result.id).update(_result);
    }

    if (_competition == competition.DecibelShow) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelShow': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    }
    else if (_competition == competition.DecibelLeague) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelLeague': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    }
    else if (_competition == competition.DecibelVolume) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelVolume': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    }
    else if (_competition == competition.DecibelBattleQualy) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelBattle': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    }
  }

  deleteResult(_result: result, _participant: participant) {
    this._db.list<result>('/results/' + _result.id).remove();
    if (_result.competition == competition.DecibelShow) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelShow': null});
    }
    else if (_result.competition == competition.DecibelLeague) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelLeague': null});
    }
    else if (_result.competition == competition.DecibelVolume) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelVolume': null});
    }
    else if (_result.competition == competition.DecibelBattleQualy) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelBattle': null});
    }
  }

  sortResult(idevent: string, _class: competitionclass): void {

    this._db.list<result>('/results/',
      ref => (ref.orderByChild('idevent').equalTo(idevent)
      )).query.once("value").then( resultsval =>
      {
        let arrayResults: result[] = [];
        resultsval.forEach(resultval => {
          let curresult: result = resultval.val() as result;
          if (curresult.idclass == _class.id)
            arrayResults.push(curresult);
          }
        );

        arrayResults.sort(this.bestresult);

        let place: number = 1;

        arrayResults.forEach(item => {
          if (item.result == 0) {
            item.place =  99;
          }
          else {
            item.place = place;
            place++;
          }
          this._db.object('/results/' + item.id).update({"place": item.place});
          if (item.idparticipant == '' || item.idparticipant == undefined) {

          }
          else {
            this.updateResultInParticipant(item.competition, item.idevent, item.idparticipant, item);
          }
        })

      }
    )
  }

  updateResultInParticipant(_competition: competition, idevent: string, idparticipant: string, gettenpoint: result) {
    if (_competition == competition.DecibelVolume) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'pointDecibelVolume': gettenpoint});
    }
    else if (_competition == competition.DecibelBattleQualy) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'pointDecibelBattle': gettenpoint});
    }
    else if (_competition == competition.DecibelLeague) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'pointDecibelLeague': gettenpoint});
    }
    else if (_competition == competition.DecibelShow) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'pointDecibelShow': gettenpoint});
    }
  }

  getResultssOfEvent(idevent: string) {
    return this._db.list<result>('/results/',
      ref => (ref.orderByChild('idevent').equalTo(idevent)
      )).valueChanges();
  }

  bestresult( a: result, b: result) {
    if ( a.result > b.result ){
      return -1;
    }
    if ( a.result < b.result ){
      return 1;
    }
    return 0;
  }

  getResultsClasses(results: result[], idlocalclass: string): result[] {
    if (results !== undefined) {
      return results.filter(option => option.idclass == idlocalclass && option.place !== 99).sort(this.bestresult)
    }
    return []
  }

  /*  setResult(_result: result, _participant: participant, _class: competitionclass) {

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
    /!*if (_participant.team == undefined) {
      _result.idteam = "";
    }
    else {
      _result.idteam = _participant.team.id;
    }*!/
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
*/
}
