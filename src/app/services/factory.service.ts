import { Injectable } from '@angular/core';
import {
  car,
  competition,
  competitionclass,
  datacar,
  event,
  eventstatus,
  participant,
  person,
  point, result,
  season,
  team
} from '../interfaces/app.interface';

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

@Injectable({
  providedIn: 'root'
})

export class FactoryService {

  constructor() { }


  getnewParticipantclass(idcurrentevent) {
    let _person = this.getnewPerson();
    let _idevent = idcurrentevent;
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
      pointDecibelLeague: point = null;
      pointDecibelBattle: point = null;
      pointDecibelVolume: point = null;
      pointDecibelShow: point = null;
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

  getNewResult() {
    let _class = this.getNewCompetitionClass();
    return new class implements result {
      id: string = "";
      competition: competition;
      class: competitionclass = _class;
      idperson: string = "";
      idparticipant: string = "";
      idcar: string = "";
      idevent: string = "";
      idseason: string = "";
      front: number = 0;
      sub: number = 0;
      result: number = 0
      outputpower: string = ""
      checkin: boolean = false
    }

    }

    getNewPoint(competition: competition, competitionclass: competitionclass) {
      return new class implements point {
        id: string = "";
        //idparticipant: string = "";
        idteam: string = "";
        idperson: string = "";
        idcar: string = "";
        idevent: string = "";
        idseason: string = "";
        competition: competition;
        class: competitionclass;
        bestresult: number = 0;
        point: number = 0;
        place: number = 99
      }
    }

}
