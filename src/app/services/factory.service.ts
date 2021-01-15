import {Injectable} from '@angular/core';
import {
  car,
  competition,
  competitionclass,
  datacar,
  event,
  eventstatus,
  participant,
  person,
  result,
  season,
  team
} from '../interfaces/app.interface';

export const arraystatuses: eventstatus[] = [];
arraystatuses.push(eventstatus.inplan);
arraystatuses.push(eventstatus.begun);
arraystatuses.push(eventstatus.finish);
arraystatuses.push(eventstatus.canceled);

export const arraycompetition: competition[] = [];
arraycompetition.push(competition.DecibelLeague);
arraycompetition.push(competition.DecibelBattleQualy);
arraycompetition.push(competition.DecibelShow);
arraycompetition.push(competition.DecibelVolume);
arraycompetition.push(competition.DecibelShow2020);
arraycompetition.push(competition.DecibelVolume2020);

@Injectable({
  providedIn: 'root'
})

export class FactoryService {

  constructor() {
  }


  getnewParticipantclass(idcurrentevent: string): participant {
    let _person = this.getnewPerson();
    let _idevent = idcurrentevent;
    //let _car = this.getnewCar();
    let _car: car = null;
    let _datacar = this.getnewDataCar();
    return new class implements participant {
      id: string = '';
      idperson: string = '';
      idevent: string = _idevent;
      person: person = _person;
      imageperson: string = '';
      car: car = _car;
      datacar: datacar = _datacar;
      team: team;
      isDecibelLeague: boolean = false;
      isDecibelBattle: boolean = false;
      isDecibelVolume: boolean = false;
      isDecibelShow: boolean = false;
      isDecibelVolume2020: boolean = false;
      isDecibelShow2020: boolean = false;
      classDecibelLeague: competitionclass;
      classDecibelBattle: competitionclass;
      classDecibelVolume: competitionclass;
      classDecibelShow: competitionclass;
      classDecibelVolume2020: competitionclass;
      classDecibelShow2020: competitionclass;
      resultDecibelLeague: result = null;
      resultDecibelBattle: result = null;
      resultDecibelVolume: result = null;
      resultDecibelShow: result = null;
      resultDecibelVolume2020: result = null;
      resultDecibelShow2020: result = null;
      registered: boolean = false;
      datainput: Date = new Date()
    }
  }

  getnewPerson() {
    return new class implements person {
      city: string = '';
      email: string = '';
      familyName: string = '';
      id: string = '';
      name: string = '';
      datainput: Date = new Date();
      telephone: string = '';
      insta: string = '';
      userUid: string = '';
    }
  }

  getnewCar() {
    return new class implements car {
      id: string = '';
      model: string = '';
      alternateName: string = ''
    }
  }

  getnewDataCar() {
    return new class implements datacar {
      id: string = '';
      idevent: string = '';
      image: string = '';
      subsize: number = 0;
      subcount: number = 0;
      nameamplifiler: string = '';
      front: string = '';
      datainput: Date = new Date()
    }
  }

  getnewSeason(): season {
    return new class implements season {
      id: string = '';
      name: string = '';
      date: Date = new Date()
    }
  }

  getnewEvent(): event {
    return new class implements event {
      id: string = '';
      name: string = '';
      season: season = new class implements season {
        id: string = '';
        name: string = '';
        date: Date = new Date()
      };
      location: string = '';
      countDecibelLeague: number = 0;
      countDecibelVolume: number = 0;
      countDecibelShow: number = 0;
      bestDecibelLeague: number = 0;
      bestDecibelVolume: number = 0;
      bestDecibelShow: number = 0;
      eventStatus: eventstatus = eventstatus.inplan;
      organizer: string = 'Car Emotion';
      startDate: Date = new Date()
    }
  }

  getNewCompetitionClass() {
    return new class implements competitionclass {
      id: string = '';
      competition: competition;
      name: string = '';
      actual: boolean = false;
      comment: string = ''
    }
  }

  getNewTeam() {
    return new class implements team {
      id: string = '';
      legalName: string = '';
      logo: string = ''
    }
  }

  getNewResult(_competition: competition, _competitionclass: competitionclass) {
    let _competitionclassempty = this.getNewCompetitionClass();
    let _person = this.getnewPerson();
    let _team = this.getNewTeam();
    return new class implements result {
      id: string = '';
      competition: competition = _competition;
      class: competitionclass = _competitionclass == undefined ? _competitionclassempty : _competitionclass;
      person: person = _person;
      team: team = _team;
      idclass: string = _competitionclass == undefined ? '' : _competitionclass.id;
      idperson: string = '';
      idparticipant: string = '';
      idcar: string = '';
      idevent: string = '';
      idseason: string = '';
      idteam: string = '';
      front: number = 0;
      sub: number = 0;
      result: number = 0;
      outputpower: string = '';
      checkin: boolean = true;
      point: number = 0;
      place: number = 99;
      totalplace: number = 999;
      event: event = undefined
    }

  }

  /*
      getNewPoint(_competition: competition, _competitionclass: competitionclass) {
        let newclass = this.getNewCompetitionClass();
        return new class implements point {
          id: string = "";
          idparticipant: string = "";
          idteam: string = "";
          idperson: string = "";
          idcar: string = "";
          idevent: string = "";
          idseason: string = "";
          competition: competition = _competition;
          idclass: string = _competitionclass == undefined ? "" : _competitionclass.id;
          class: competitionclass = _competitionclass == undefined ? newclass : _competitionclass;
          bestresult: number = 0;
          point: number = 0;
          place: number = 99
        }
      }
  */

}
