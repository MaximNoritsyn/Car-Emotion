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
  point,
  season,
  team
} from '../interfaces/app.interface';

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

}
