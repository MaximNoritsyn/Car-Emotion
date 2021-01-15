import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';

import {car, competition, competitionclass, datacar, event, participant, person, result} from '../interfaces/app.interface';
import {EventsService} from './events.service';
import {CurrentdataService} from './currentdata.service';
import {FactoryService} from './factory.service';
import {AuthService} from './auth.service';


@Injectable()
export class ParticipantsService {

  private participants: Observable<participant[]>;
  private idcurrentevent: string;

  private currentPerson: Observable<person>;
  public persons: Observable<person[]>;

  private currentCar: Observable<car>;
  public cars: Observable<car[]>;
  private idcurrentCar: string;

  private currentdatacar: Observable<datacar>;
  private datascar: Observable<datacar[]>;


  constructor(private _db: AngularFireDatabase,
              private router: Router,
              private _Auth: AuthService,
              private _EventsService: EventsService,
              private _CurrentdataService: CurrentdataService,
              private _FactoryService: FactoryService) {
    this._CurrentdataService.getEvent().subscribe(item => {
      if (item !== null) this.idcurrentevent = item.id
    });
    this.idcurrentCar = '';
    this.participants = this._db.list<participant>('/participants/' + this.idcurrentevent + '/all').valueChanges();
    this.currentPerson = this._db.object<person>('/persons/').valueChanges();
    this.persons = this._db.list<person>('/persons/').valueChanges();
    this.currentCar = this._db.object<car>('/cars/').valueChanges();
    this.cars = this._db.list<car>('/cars/').valueChanges();
    this.currentdatacar = this._db.object<datacar>('/cars/' + this.idcurrentCar + '/datacar').valueChanges();
    this.datascar = this._db.list<datacar>('/cars/' + this.idcurrentCar + '/datacar').valueChanges();
  }

  getParticipants() {
    this.participants = this._db.list<participant>('/participants/' + this.idcurrentevent + '/all').valueChanges();
    return this.participants
  }

  getParticipantByPerson(person: person) {
    return this._db.object<participant>('/participants/' + this.idcurrentevent + '/all').query;
  }

  setParticipant(_participant: participant) {
    let localevent = this._EventsService.getEventOnce(this.idcurrentevent);
    localevent.then(item => {
        if (item.val() !== null) {
          let _event: event = item.val();
          _participant.datainput = _event.startDate;
          this.writePerson(_participant, _event);
        }
      }
    )
  }

  writePerson(_participant: participant, localevent: event) {
    let _key = _participant.person.id;
    if (_key == '') {
      _participant.person.datainput = _participant.datainput;
      _participant.person.userUid = this._Auth.getUidFromTelephone(_participant.person.telephone);
      _key = this._db.list('/persons/').push(_participant.person).key;
      this._db.object('/persons/' + _key).update({'id': _key});
      _participant.person.id = _key;
      _participant.idperson = _key;
      this.writeParticipant(_participant, localevent);
    } else {
      if (_participant.person.datainput <= _participant.datainput) {
        _participant.person.datainput = _participant.datainput;
        this._db.object('/persons/' + _key).update(_participant.person)
      }
      this.writeParticipant(_participant, localevent);
    }

  }

  setPerson(_person: person) {

    let _key = _person.id;
    _person.userUid = this._Auth.getUidFromTelephone(_person.telephone);
    if (_key == '') {
      _key = this._db.list('/persons/').push(_person).key;
      this._db.object('/persons/' + _key).update({'id': _key});
    } else {
      this._db.object('/persons/' + _key).update(_person)
    }
  }

  writeCar(_participant: participant, localevent: event) {
    let _key = _participant.car.id;
    if (_participant.car.model == '') {
      this.writeParticipant(_participant, localevent);
    } else if (_key == '') {
      _key = this._db.list('/cars/').push(_participant.car).key;
      this._db.object('/cars/' + _key).update({'id': _key});
      _participant.car.id = _key;
      this.writeDataCar(_participant, localevent);
    } else {
      this._db.object('/cars/' + _key).update(_participant.car);
      this.writeDataCar(_participant, localevent);
    }
  }

  writeDataCar(_participant: participant, localevent: event) {
    _participant.datacar.idevent = _participant.idevent;
    let _key = _participant.datacar.id;
    if (_key == '') {
      _key = this._db.list('/cars/' + _participant.car.id + '/datacar/').push(_participant.datacar).key;
      this._db.object('/cars/' + _participant.car.id + '/datacar/' + _key).update({'id': _key});
      _participant.datacar.id = _key;
      this.writeParticipant(_participant, localevent);
    } else {
      this._db.object('/cars/' + _participant.car.id + '/datacar/' + _key).update(_participant.datacar);
      this.writeParticipant(_participant, localevent);
    }
  }

  writeParticipant(_participant: participant, localevent: event) {
    let _key = _participant.id;
    if (_key == '') {
      let _key = this._db.list('/participants/' + this.idcurrentevent + '/all/').push(_participant).key;
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _key).update({'id': _key});
      _participant.id = _key;
      this.generateResultsForParticipants(_participant, localevent);
    } else {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _key).update(_participant);
      this.generateResultsForParticipants(_participant, localevent);
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
  getPersonOnce(id: string) {
    return this._db.object<person>('/persons/' + id);
  }

  setidcurrenevent(id: string) {
    this.idcurrentevent = id;
  }

  getCars() {
    return this.cars;
  }

  getDataCarOnce(idcar: string) {
    return this._db.list<datacar>('/cars/' + idcar + '/datacar').query.once('value')
  }

  generateResultsForParticipants(_participant: participant, localevent: event) {

    if (_participant.registered) {
      if (_participant.isDecibelShow) {
        let _result = _participant.resultDecibelShow;
        if (_participant.resultDecibelShow == undefined) {
          _result = this._FactoryService.getNewResult(competition.DecibelShow, _participant.classDecibelShow);
        }
        this.generateResult(_result, _participant, competition.DecibelShow, localevent);
      }

      if (_participant.isDecibelLeague) {
        let _result = _participant.resultDecibelLeague;
        if (_participant.resultDecibelLeague == undefined) {
          let _result = this._FactoryService.getNewResult(competition.DecibelLeague, _participant.classDecibelLeague);
        }
        this.generateResult(_result, _participant, competition.DecibelLeague, localevent);
      }

      if (_participant.isDecibelVolume) {
        let _result = _participant.resultDecibelVolume;
        if (_participant.resultDecibelVolume == undefined) {
          let _result = this._FactoryService.getNewResult(competition.DecibelVolume, _participant.classDecibelVolume);
        }
        this.generateResult(_result, _participant, competition.DecibelVolume, localevent);
      }

      if (_participant.isDecibelBattle && _participant.resultDecibelBattle == undefined) {
        let _result = _participant.resultDecibelBattle;
        if (_participant.resultDecibelBattle) {
          let _result = this._FactoryService.getNewResult(competition.DecibelBattleQualy, _participant.classDecibelBattle);
        }
        this.generateResult(_result, _participant, competition.DecibelBattleQualy, localevent);
      }
    } else {
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

  generateResult(_result: result, _participant: participant, _competition: competition, localevent: event) {
    _result.idevent = _participant.idevent;
    _result.competition = _competition;
    if (_participant.car == undefined) {
      _result.idcar = '';
    } else {
      _result.idcar = _participant.car.id;
    }
    if (_participant.team == undefined) {
      _result.idteam = '';
    } else {
      _result.idteam = _participant.team.id;
      _result.team = _participant.team;
    }

    _result.event = localevent;
    _result.idseason = localevent.season.id;

    if (_participant.person == undefined) {
      _result.idperson = '';
    } else {
      _result.idperson = _participant.person.id;
      _result.person = _participant.person;
    }

    if (_competition == competition.DecibelShow) {
      _result.class = _participant.classDecibelShow;
      if (_participant.resultDecibelShow !== undefined && _participant.resultDecibelShow.id !== '') {
        _result.id = _participant.resultDecibelShow.id;
      }
      //_result.result = _result.front + _result.sub;
    } else if (_competition == competition.DecibelLeague) {
      _result.class = _participant.classDecibelLeague;
      if (_participant.resultDecibelLeague !== undefined && _participant.resultDecibelLeague.id !== '') {
        _result.id = _participant.resultDecibelLeague.id;
      }
    } else if (_competition == competition.DecibelVolume) {
      _result.class = _participant.classDecibelVolume;
      if (_participant.resultDecibelVolume !== undefined && _participant.resultDecibelVolume.id !== '') {
        _result.id = _participant.resultDecibelVolume.id;
      }
    }
    else if (_competition == competition.DecibelVolume2020) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelVolume2020': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    }
    else if (_competition == competition.DecibelShow2020) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelShow2020': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    } else if (_competition == competition.DecibelBattleQualy) {
      _result.class = _participant.classDecibelBattle;
      if (_participant.resultDecibelBattle !== undefined && _participant.resultDecibelBattle.id !== '') {
        _result.id = _participant.resultDecibelBattle.id;
      }
    }

    if (_result.class !== undefined) {
      _result.idclass = _result.class.id;
    } else {
      _result.idclass = '';
    }

    _result.idparticipant = _participant.id;

    if (_result.id == '') {
      let _key = this._db.list<result>('/results/').push(_result).key;
      this._db.object<result>('/results/' + _key).update({'id': _key});
      _result.id = _key;
    } else {
      this._db.object<result>('/results/' + _result.id).update(_result);
    }

    if (_competition == competition.DecibelShow) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelShow': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    } else if (_competition == competition.DecibelLeague) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelLeague': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    } else if (_competition == competition.DecibelVolume) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelVolume': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    }
    else if (_competition == competition.DecibelVolume2020) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelVolume2020': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    }
    else if (_competition == competition.DecibelShow2020) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelShow2020': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    } else if (_competition == competition.DecibelBattleQualy) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id)
        .update({'resultDecibelBattle': _result})
        .then(item => this.sortResult(_result.idevent, _result.class));
    }
  }

  deleteResult(_result: result, _participant: participant) {
    this._db.list<result>('/results/' + _result.id).remove();
    if (_result.competition == competition.DecibelShow) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelShow': null});
    } else if (_result.competition == competition.DecibelLeague) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelLeague': null});
    } else if (_result.competition == competition.DecibelVolume) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelVolume': null});
    } else if (_result.competition == competition.DecibelVolume2020) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelVolume2020': null});
    } else if (_result.competition == competition.DecibelShow2020) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelShow2020': null});
    } else if (_result.competition == competition.DecibelBattleQualy) {
      this._db.object('/participants/' + this.idcurrentevent + '/all/' + _participant.id).update({'resultDecibelBattle': null});
    }
  }

  sortResult(idevent: string, _class: competitionclass): void {

    this._db.list<result>('/results/',
      ref => (ref.orderByChild('idevent').equalTo(idevent)
      )).query.once('value').then(resultsval => {
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
            item.place = 99;
          } else {
            item.place = place;
            place++;
          }
          this._db.object('/results/' + item.id).update({'place': item.place});
          if (item.idparticipant == '' || item.idparticipant == undefined) {

          } else {
            this.updateResultInParticipant(item.competition, item.idevent, item.idparticipant, item);
          }
        })
      }
    )
  }

  updateResultInParticipant(_competition: competition, idevent: string, idparticipant: string, gettenpoint: result) {
    if (_competition == competition.DecibelVolume) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'resultDecibelVolume': gettenpoint});
    } else if (_competition == competition.DecibelBattleQualy) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'resultDecibelBattle': gettenpoint});
    } else if (_competition == competition.DecibelLeague) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'resultDecibelLeague': gettenpoint});
    } else if (_competition == competition.DecibelShow) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'resultDecibelShow': gettenpoint});
    } else if (_competition == competition.DecibelVolume2020) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'resultDecibelVolume2020': gettenpoint});
    } else if (_competition == competition.DecibelShow2020) {
      this._db.object('/participants/' + idevent + '/all/' + idparticipant).update({'resultDecibelShow2020': gettenpoint});
    }
  }

  getResultssOfEvent(idevent: string) {
    return this._db.list<result>('/results/',
      ref => (ref.orderByChild('idevent').equalTo(idevent)
      )).valueChanges();
  }

  getResultssOfPerson(idperson: string) {
    return this._db.list<result>('/results/',
      ref => (ref.orderByChild('idperson').equalTo(idperson)
      )).valueChanges();
  }

  getBestResultssOfCompetition(_competition: competition) {
    return this._db.list<result>('/totalresults/' + _competition.toString()).valueChanges();
  }

  getBestResultsOfPerson(_competition: competition, idperson: string) {
    return this._db.list<result>('/totalresults/' + _competition.toString(),
      ref => (ref.orderByChild('idperson').equalTo(idperson))).valueChanges();
  }

  bestresult(a: result, b: result) {
    if (a.result > b.result) {
      return -1;
    }
    if (a.result < b.result) {
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

  countAllResults() {
    this.totalsortResult(competition.DecibelVolume);
    this.totalsortResult(competition.DecibelLeague);
    this.totalsortResult(competition.DecibelShow);
    this.totalsortResult(competition.DecibelVolume2020);
    this.totalsortResult(competition.DecibelShow2020);
  }

  totalsortResult(_competition: competition): void {

    this._db.list<result>('/totalresults/' + _competition.toString()).remove()
      .then(none =>
        this._db.list<result>('/results/',
          ref => (ref.orderByChild('competition').equalTo(_competition)
          )).query.once('value').then(resultsval => {
            let arrayResults: result[] = [];
            let bestResults: result[] = [];
            resultsval.forEach(resultval => {
                let curresult: result = resultval.val() as result;
                arrayResults.push(curresult);
              }
            );

            arrayResults.sort(this.bestresult);

            let totalplace: number = 1;

            arrayResults.forEach(item => {
              if (bestResults.findIndex(itembestresult => itembestresult.idperson === item.idperson) < 0) {
                if (item.result == 0) {
                  item.totalplace = 999;
                } else {
                  item.totalplace = totalplace;
                  bestResults.push(item);
                  totalplace++;
                }
              }
            });
            bestResults.forEach(item => {
                this._db.list<result>('/totalresults/' + _competition.toString()).push(item);
              }
            )

          }
        )
      )
  }

  duty_inputUserUid(): void {
    this._db.list<person>('/persons/').query.once('value').then(personsval => {
      personsval.forEach(personval => {

        let correctresult: person = personval.val() as person;
        correctresult.userUid = this._Auth.getUidFromTelephone(correctresult.telephone);
        this._db.object<person>('/persons/' + correctresult.id).update({'userUid': correctresult.userUid});
        this._db.object<person>('/persons/' + correctresult.id).update({'insta': ""})
      })
    })
  }

  duty_inputIdParticipant(): void {
    this._db.list('/participants/').query.once('value').then(events => {
      events.forEach(event => {
        event.forEach(_participants => {
          _participants.forEach(_value => {
            let _participant: participant = _value.val();
            if (_participant.person == undefined) {
              console.log(_value.key)
            } else {
              this._db.object('/participants/' + _participant.idevent + '/all/' + _participant.id).update(
                {'idperson': _participant.person.id}
              )
            }
          })
        })
      })
    })
  }

  duty_controlresults(): void {

    this._db.list<result>('/results/').query.once('value').then(
      resultsval => {
        let arrayResults: result[] = [];
        resultsval.forEach(resultval => {
          let curresult: result = resultval.val() as result;
          arrayResults.push(curresult);
        });

        arrayResults.forEach(item => {

            //if (item.idseason == "" && item.place !== 99) {
            if (true) {

              if (arrayResults.findIndex(itemresult =>
                itemresult.competition == item.competition &&
                itemresult.idperson === item.idperson &&
                itemresult.idevent === item.idevent &&
                itemresult.id !== item.id
              ) >= 0) {

                let correctresult = arrayResults[arrayResults.findIndex(itemresult =>
                  itemresult.competition == item.competition &&
                  itemresult.idperson === item.idperson &&
                  itemresult.idevent === item.idevent &&
                  itemresult.id !== item.id
                )];

                correctresult.front = item.front;
                correctresult.sub = item.sub;
                correctresult.result = item.result;
                correctresult.outputpower = item.outputpower;

                this._db.list<result>('/results/' + item.id).remove();
                this._db.object<result>('/results/' + correctresult.id).update(correctresult);
                if (correctresult.competition == competition.DecibelShow) {
                  this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
                    .update({'resultDecibelShow': correctresult})
                    .then(item => this.sortResult(correctresult.idevent, correctresult.class));
                } else if (correctresult.competition == competition.DecibelLeague) {
                  this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
                    .update({'resultDecibelLeague': correctresult})
                    .then(item => this.sortResult(correctresult.idevent, correctresult.class));
                } else if (correctresult.competition == competition.DecibelVolume) {
                  this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
                    .update({'resultDecibelVolume': correctresult})
                    .then(item => this.sortResult(correctresult.idevent, correctresult.class));
                } else if (correctresult.competition == competition.DecibelVolume2020) {
                  this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
                    .update({'resultDecibelVolume2020': correctresult})
                    .then(item => this.sortResult(correctresult.idevent, correctresult.class));
                } else if (correctresult.competition == competition.DecibelShow2020) {
                  this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
                    .update({'resultDecibelShow2020': correctresult})
                    .then(item => this.sortResult(correctresult.idevent, correctresult.class));
                } else if (correctresult.competition == competition.DecibelBattleQualy) {
                  this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
                    .update({'resultDecibelBattle': correctresult})
                    .then(item => this.sortResult(correctresult.idevent, correctresult.class));
                }
              }
            }
          }
        );
      }
    )
  }

  duty_getParticipants() {
    return this._db.list('/participants/').query.once('value');
  }

  duty_updateresultsbyevent(_event: event) {
    this._db.list<result>('/results/',
      ref => (ref.orderByChild('idevent').equalTo(_event.id)
      )
    ).query.once('value').then(resultsval => {

        resultsval.forEach(resultval => {
          let correctresult: result = resultval.val() as result;
          correctresult.event = _event;
          correctresult.idseason = _event.season.id;

          this._db.object<result>('/results/' + correctresult.id).update(correctresult);
          if (correctresult.competition == competition.DecibelShow) {
            this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
              .update({'resultDecibelShow': correctresult})
              .then(item => this.sortResult(correctresult.idevent, correctresult.class));
          } else if (correctresult.competition == competition.DecibelLeague) {
            this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
              .update({'resultDecibelLeague': correctresult})
              .then(item => this.sortResult(correctresult.idevent, correctresult.class));
          } else if (correctresult.competition == competition.DecibelVolume) {
            this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
              .update({'resultDecibelVolume': correctresult})
              .then(item => this.sortResult(correctresult.idevent, correctresult.class));
          } else if (correctresult.competition == competition.DecibelVolume2020) {
            this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
              .update({'resultDecibelVolume2020': correctresult})
              .then(item => this.sortResult(correctresult.idevent, correctresult.class));
          } else if (correctresult.competition == competition.DecibelShow2020) {
            this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
              .update({'resultDecibelShow2020': correctresult})
              .then(item => this.sortResult(correctresult.idevent, correctresult.class));
          } else if (correctresult.competition == competition.DecibelBattleQualy) {
            this._db.object('/participants/' + this.idcurrentevent + '/all/' + correctresult.idparticipant)
              .update({'resultDecibelBattle': correctresult})
              .then(item => this.sortResult(correctresult.idevent, correctresult.class));
          }
        });

      }
    )
  }
}
