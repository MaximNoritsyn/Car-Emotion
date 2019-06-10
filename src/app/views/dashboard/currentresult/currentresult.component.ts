import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {CurrentdataService} from '../../../services/currentdata.service';
import {EventsService} from '../../../services/events.service';
import {competition, competitionclass, event, participant, result} from '../../../interfaces/app.interface';
import {arraycompetition, FactoryService} from '../../../services/factory.service';
import {ParticipantsService} from '../../../services/participants.service';
import {Observable} from 'rxjs/Rx';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-currentresult',
  templateUrl: './currentresult.component.html',
  styleUrls: ['./currentresult.component.css']
})
export class CurrentresultComponent implements OnInit {

  public currentevent: event;
  public currentcompetition: competition;
  //public currentcompetitionclass: competitionclass;
  public arrayCompetitons: competition[] = arraycompetition;
  public arrayCompetitonsClass: competitionclass[];

  private participants: participant[] = [];
  private FilteredPersonsLeft: Observable<participant[]>;
  private FilteredPersonsRight: Observable<participant[]>;
  private ControlLeft = new FormControl();
  private ControlRight = new FormControl();

  public participantleft: participant;
  public participantright: participant;

  public classleft: competitionclass;
  public classright: competitionclass;

  public resultlefttop: result;
  public resultleft2: result;
  public resultrighttop: result;
  public resultright2: result;

  /*public currentresult1: result;
  public currentresult2: result;
  public clearparticipant: participant;

  public currentparticipant1: participant[] = [];
  public currentparticipant2: participant[] = [];

  public participants: participant[];
  public turn1: participant[] = [];
  public turn2: participant[] = [];*/

  constructor(public _auth: AuthService,
              private router: Router,
              private _CurrentdataService: CurrentdataService,
              private _EventsService: EventsService,
              private _ParticipantsService: ParticipantsService,
              private _FactoryService: FactoryService) { }

  ngOnInit() {
    this.classleft = this._FactoryService.getNewCompetitionClass();
    this.classright = this._FactoryService.getNewCompetitionClass();
    this.currentevent = this._FactoryService.getnewEvent();
    this._CurrentdataService.getEvent().subscribe(item => {
      this.currentevent = item;
      this._ParticipantsService.setidcurrenevent(this.currentevent.id)
    });
    this._CurrentdataService.getCompetition().subscribe(item => {
      this.currentcompetition = item;
      this.onChangecompetition(item)
    });
    this.FilteredPersonsLeft = this.ControlLeft.valueChanges
      .pipe(
        startWith(''),
        map(value => {return typeof value === 'string' ? this._filterperson(value) : this._setParticipant(true, value)
          }
        )
      );
    this.FilteredPersonsRight = this.ControlRight.valueChanges
      .pipe(
        startWith(''),
        map(value => {return typeof value === 'string' ? this._filterperson(value) : this._setParticipant(false, value)
          }
        )
      );
      /*this._CurrentdataService.getCompetitionClass().subscribe(item => {
        this.currentcompetitionclass = item;
        this._ParticipantsService.getParticipants().subscribe(curparticipants => {
            this.participants = curparticipants.filter(curparticipant => {
              if (this.currentcompetitionclass.competition == competition.DecibelShow) {
                return curparticipant.classDecibelShow.id == this.currentcompetitionclass.id
              } else if (this.currentcompetitionclass.competition == competition.DecibelLeague) {
                return curparticipant.classDecibelLeague.id == this.currentcompetitionclass.id
              } else if (this.currentcompetitionclass.competition == competition.DecibelBattle) {
                return curparticipant.classDecibelBattle.id == this.currentcompetitionclass.id
              } else if (this.currentcompetitionclass.competition == competition.DecibelVolume) {
                return curparticipant.classDecibelVolume.id == this.currentcompetitionclass.id
              }
              return false
            })
          }
        );
    });
    this.currentresult1 = this._FactoryService.getNewResult();
    this.currentresult2 = this._FactoryService.getNewResult();
    this.clearparticipant = this._FactoryService.getnewParticipantclass("");
    this.currentparticipant1.push(this.clearparticipant);
    this.currentparticipant2.push(this.clearparticipant);*/

    /*this._EventsService.getCompetitionClassesObs().subscribe(items => {
      this.arrayCompetitonsClass = this._EventsService.getCompetitionClasses(items, this.currentcompetition);
    });*/
   /* this._CurrentdataService.getTurn1().subscribe(items => this.turn1 = items);
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
    this._CurrentdataService.getCurrentResult1().subscribe(item => this.currentresult1 = item);
    this._CurrentdataService.getCurrentResult2().subscribe(item => this.currentresult2 = item);*/
  }

  selectedCompetition(competitionel: any, currentcompetitionel: any) {
    return competitionel == currentcompetitionel;
  }

  selectedCompetitionClass(competitionel: competitionclass, currentcompetitionel: competitionclass) {
    let value: boolean;
    if (currentcompetitionel == null) { value = false} else {value = competitionel.id === currentcompetitionel.id}
    return value;
  }

  onChangecompetition(_event: competition) {

    this.currentcompetition = _event;
    this._ParticipantsService.getParticipants().subscribe(items =>
    {
      this.participants = items.filter( participants =>
      {if (this.currentcompetition == competition.DecibelShow) {
        return participants.isDecibelShow
      }
      else if (this.currentcompetition == competition.DecibelVolume) {
        return participants.isDecibelVolume
      }
      else if (this.currentcompetition == competition.DecibelBattle) {
        return participants.isDecibelBattle
      }
      else if (this.currentcompetition == competition.DecibelLeague) {
        return participants.isDecibelLeague
      }
      return false
      })
    })
    this.arrayCompetitonsClass = [];
    this._EventsService.getCompetitionClassesObs().subscribe(items => {
      this.arrayCompetitonsClass = this._EventsService.getCompetitionClasses(items, this.currentcompetition);
      this.setclasses();
    });
    this._CurrentdataService.setCompetition(_event);

  }

  displayPerson(participant: participant): string | undefined {
    return participant ? participant.person.familyName + " - " + participant.person.name : undefined;
  }

  private _filterperson(name: string): participant[] {
    const filterValue = name.toLowerCase();
    return this.participants.filter(participants =>
      participants.person.name.toLowerCase().indexOf(filterValue) === 0 || participants.person.familyName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  _setParticipant(left: boolean, value: participant): undefined {

    if (left) {
      this.participantleft = value;
    }
    else {
      this.participantright = value;
    }
    this.setclasses();
    return null
  }

  setclasses() {
    let _clearclass = this._FactoryService.getNewCompetitionClass();
    {
      if (this.currentcompetition == competition.DecibelShow) {
        this.classleft = this.participantleft == undefined ? _clearclass: this.participantleft.classDecibelShow
        this.classright = this.participantright == undefined ? _clearclass: this.participantright.classDecibelShow
      } else if (this.currentcompetition == competition.DecibelVolume) {
        this.classleft = this.participantleft == undefined ? _clearclass: this.participantleft.classDecibelVolume
        this.classright = this.participantright == undefined ? _clearclass: this.participantright.classDecibelVolume
      } else if (this.currentcompetition == competition.DecibelBattle) {
        this.classleft = this.participantleft == undefined ? _clearclass: this.participantleft.classDecibelBattle
        this.classright = this.participantright == undefined ? _clearclass: this.participantright.classDecibelBattle
      } else if (this.currentcompetition == competition.DecibelLeague) {
        this.classleft = this.participantleft == undefined ? _clearclass: this.participantleft.classDecibelLeague
        this.classright = this.participantright == undefined ? _clearclass: this.participantright.classDecibelLeague
      }
    }
  }

  ClearResults() {
    /*this._CurrentdataService.setCurrentParticipant1(this.clearparticipant);
    this._CurrentdataService.setCurrentParticipant2(this.clearparticipant);
    this._CurrentdataService.setCurrentResult1(this._FactoryService.getNewResult());
    this._CurrentdataService.setCurrentResult2(this._FactoryService.getNewResult());*/

  }

  SaveResults() {

    /*if(this.currentresult1.front > 0) {
      this._ParticipantsService.setResult(this.currentresult1, this.currentparticipant1[0], this.currentcompetitionclass);
    }
    if(this.currentresult2.front > 0) {
      this._ParticipantsService.setResult(this.currentresult2, this.currentparticipant2[0], this.currentcompetitionclass);
    }
    this._CurrentdataService.setCurrentResult1(this._FactoryService.getNewResult());
    this._CurrentdataService.setCurrentResult2(this._FactoryService.getNewResult());*/
  }

  onChangecompetitionClass(_event: any, left: boolean) {
    if (left) {
      if (this.currentcompetition == competition.DecibelLeague) {
        this.participantleft.classDecibelLeague = _event;
      }
      else if (this.currentcompetition == competition.DecibelBattle) {
        this.participantleft.classDecibelBattle = _event;
      }
      else if (this.currentcompetition == competition.DecibelVolume) {
        this.participantleft.classDecibelVolume = _event;
      }
      else if (this.currentcompetition == competition.DecibelShow) {
        this.participantleft.classDecibelShow = _event;
      }
      this._ParticipantsService.setParticipant(this.participantleft);
    }
    else {
      if (this.currentcompetition == competition.DecibelLeague) {
        this.participantright.isDecibelLeague = _event;
      }
      else if (this.currentcompetition == competition.DecibelBattle) {
        this.participantright.isDecibelBattle = _event;
      }
      else if (this.currentcompetition == competition.DecibelVolume) {
        this.participantright.isDecibelVolume = _event;
      }
      else if (this.currentcompetition == competition.DecibelShow) {
        this.participantright.isDecibelShow = _event;
      }
      this._ParticipantsService.setParticipant(this.participantright);
    }
  }

  /*onDrop(event: CdkDragDrop<participant[]>) {
    if (!this._auth.isAdministrator()) {}
    else if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.setAnyTurn(event.container);
    }
    else if (event.previousContainer.id == "participants") {
      event.container.data.push(event.previousContainer.data[event.previousIndex]);
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
      if ((event.previousContainer.id == "result1" && this.currentresult1.front !== 0) ||
        (event.previousContainer.id == "result2" && this.currentresult2.front !== 0))
      {
        return;
      }
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

  disbledresults(_currentparticipant: participant[]) {
    return _currentparticipant[0].id == '' || !this._auth.isAdministrator();
  }

  changeresult(_number: number) {
    if (_number == 1) {
      this._CurrentdataService.setCurrentResult1(this.currentresult1);
    }
    else if (_number == 2) {
      this._CurrentdataService.setCurrentResult2(this.currentresult2);
    }
  }

  bestResultcurrentclass(_participant: participant): number {
    if (this.currentcompetitionclass.competition == competition.DecibelVolume) {
      return _participant.pointDecibelVolume.bestresult;
    }
    else if (this.currentcompetitionclass.competition == competition.DecibelBattle) {
      return _participant.pointDecibelBattle.bestresult;
    }
    else if (this.currentcompetitionclass.competition == competition.DecibelLeague) {
      return _participant.pointDecibelLeague.bestresult;
    }
    else if (this.currentcompetitionclass.competition == competition.DecibelShow) {
      return _participant.pointDecibelShow.bestresult;
    }
    return 0;
  }

  IsDecibelShow() {
    return this.currentcompetition == competition.DecibelShow;
  }



  onDropparticipants(event: CdkDragDrop<participant[]>) {
    if (!this._auth.isAdministrator()) {}
    else if(event.previousContainer !== event.container) {
      if (event.previousIndex > -1)
      {
        event.previousContainer.data.splice(event.previousIndex, 1);
      }
      this.setAnyTurn(event.previousContainer);
    }
  }

  onDropresult(event: CdkDragDrop<participant[]>) {
    if(event.previousContainer === event.container || !this._auth.isAdministrator()) {
      // nothng t o do
    }
    if (event.previousContainer.id == "participantTurn1" || event.previousContainer.id == "participantTurn2") {
      if (event.container.data[0].id == "")
      {event.container.data.pop()}
      else
      {return}
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

  setAnyTurn(_cont: any) {
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
  }*/
}
