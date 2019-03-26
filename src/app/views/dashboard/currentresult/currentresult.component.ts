import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {CurrentdataService} from '../../../services/currentdata.service';
import {EventsService} from '../../../services/events.service';
import {competition, competitionclass, event, participant, result} from '../../../interfaces/app.interface';
import {arraycompetition, FactoryService} from '../../../services/factory.service';
import {ParticipantsService} from '../../../services/participants.service';
import {CdkDragDrop, CdkDrag, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-currentresult',
  templateUrl: './currentresult.component.html',
  styleUrls: ['./currentresult.component.css']
})
export class CurrentresultComponent implements OnInit {

  private currentevent: event;
  private currentcompetition: competition;
  private currentcompetitionclass: competitionclass;
  private arrayCompetitons: competition[] = arraycompetition;
  private arrayCompetitonsClass: competitionclass[];

  private clearparticipant: participant;
  private clearresult: result;

  private currentresult1: result;
  private currentresult2: result;

  private currentparticipant1: participant[] = [];
  private currentparticipant2: participant[] = [];

  private participants: participant[];
  private turn1: participant[] = [];
  private turn2: participant[] = [];

  constructor(private authService: AuthService,
              private router: Router,
              private _CurrentdataService: CurrentdataService,
              private _EventsService: EventsService,
              private _ParticipantsService: ParticipantsService,
              private _FactoryService: FactoryService) { }

  ngOnInit() {
    this.clearparticipant = this._FactoryService.getnewParticipantclass("");
    this.currentparticipant1.push(this.clearparticipant);
    this.currentparticipant2.push(this.clearparticipant);
    this.currentresult1 = this._FactoryService.getNewResult();
    this.currentresult2 = this._FactoryService.getNewResult();
    this.currentcompetitionclass = this._FactoryService.getNewCompetitionClass();
    this.currentevent = this._FactoryService.getnewEvent();
    this._CurrentdataService.getEvent().subscribe(item => {
      this.currentevent = item;
      this._ParticipantsService.setidcurrenevent(this.currentevent.id);
      this._ParticipantsService.getParticipants().subscribe(items => {this.participants = items});
    });
    this._CurrentdataService.getCompetition().subscribe(item => {this.currentcompetition = item});

    this._CurrentdataService.getCompetitionClass().subscribe(item => {this.currentcompetitionclass = item});

    this._EventsService.getCompetitionClassesObs().subscribe(items => {
      this.arrayCompetitonsClass = this._EventsService.getCompetitionClasses(items, this.currentcompetition);
    });
    this._CurrentdataService.getTurn1().subscribe(items => this.turn1 = items);
    this._CurrentdataService.getTurn2().subscribe(items => this.turn2 = items);
    this._CurrentdataService.getCurrentParticipant1().subscribe(items => {if (items == null){
      this.currentparticipant1.pop();
      this.currentparticipant1.push(this.clearparticipant);
    }
    else {
      this.currentparticipant1.pop();
      this.currentparticipant1.push(items)
    }});
    this._CurrentdataService.getCurrentParticipant2().subscribe(items => {if (items == null){
      this.currentparticipant2.pop();
      this.currentparticipant2.push(this.clearparticipant);
    }
    else {
      this.currentparticipant2.pop();
      this.currentparticipant2.push(items)
    }});
  }

  selectedCompetition(competitionel, currentcompetitionel) {
    return competitionel == currentcompetitionel;
  }

  selectedCompetitionClass(competitionel, currentcompetitionel) {
    let value: boolean;
    if (currentcompetitionel == null) { value = false} else {value = competitionel.id === currentcompetitionel.id};
    return value;
  }

  onChangecompetition(_event) {
    this.currentcompetition = _event;
    this.currentcompetitionclass = this._FactoryService.getNewCompetitionClass();
    this.arrayCompetitonsClass = [];
    this._EventsService.getCompetitionClassesObs().subscribe(items => {
      this.arrayCompetitonsClass = this._EventsService.getCompetitionClasses(items, this.currentcompetition);
    })
    this._CurrentdataService.setCompetition(_event);
  }

  onChangecompetitionClass(_event) {
    this._CurrentdataService.setCompetitionClass(_event);
  }

  onDrop(event: CdkDragDrop<participant[]>) {
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.setAnyTurn(event.container);
    }
    else if (event.previousContainer.id == "participants") {
      event.container.data.push(event.previousContainer.data[event.previousIndex])
      this.setAnyTurn(event.container);
    }
    else if (event.previousContainer.id == "participantTurn1" || event.previousContainer.id == "participantTurn2") {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.setAnyTurn(event.container);
      this.setAnyTurn(event.previousContainer);
    }
    else if (event.previousContainer.id == "result1" || event.previousContainer.id == "result2") {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      event.previousContainer.data.push(this.clearparticipant);
      this.setAnyTurn(event.container);
      this.setAnyTurn(event.previousContainer);
    }
    else {
      console.log(event);
    }
  }

  onDropparticipants(event: CdkDragDrop<participant[]>) {
    if(event.previousContainer !== event.container) {
      if (event.previousIndex > -1)
      {
        event.previousContainer.data.splice(event.previousIndex, 1);
      }
      this.setAnyTurn(event.previousContainer);
    }
  }

  setAnyTurn(_cont) {
    if (_cont.id == "participantTurn1") {
      this._CurrentdataService.setTurn1(_cont.data);
    }
    else if (_cont.id == "participantTurn2") {
      this._CurrentdataService.setTurn2(_cont.data);
    }
    else if (_cont.id == "result1") {
      this._CurrentdataService.setCurrentParticipant1(_cont.data[0]);
    }
    else if (_cont.id == "result2") {
      this._CurrentdataService.setCurrentParticipant2(_cont.data[0]);
    }
  }

  onDropresult(event: CdkDragDrop<participant[]>) {
    if(event.previousContainer === event.container) {
      // nothng to do
    }
    if (event.previousContainer.id == "participantTurn1" || event.previousContainer.id == "participantTurn2") {
      if (event.container.data[0].id == "")
        {event.container.data.pop()}
      else
        {return};
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.setAnyTurn(event.container);
      this.setAnyTurn(event.previousContainer);
    }
    if (event.previousContainer.id == "result1" || event.previousContainer.id == "result2") {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.setAnyTurn(event.container);
      this.setAnyTurn(event.previousContainer);
    }
  }

  ClearResults() {

    this._CurrentdataService.setCurrentParticipant1(this.clearparticipant);
    this._CurrentdataService.setCurrentParticipant2(this.clearparticipant);
    /*this._CurrentdataService.setCurrentResult1(this.clearresult);
    this._CurrentdataService.setCurrentResult2(this.clearresult);*/

  }

}
