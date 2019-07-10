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

  public participants: participant[] = [];
  public FilteredPersonsLeft: Observable<participant[]>;
  public FilteredPersonsRight: Observable<participant[]>;
  public ControlLeft = new FormControl();
  public ControlRight = new FormControl();

  public participantleft: participant;
  public participantright: participant;

  public classleft: competitionclass;
  public classright: competitionclass;

  public resultlefttop: result;
  public resultleft2: result;
  public resultrighttop: result;
  public resultright2: result;

  public currentresultleft: result;
  public currentresultright: result;

  compDecibelLeague: competition = competition.DecibelLeague;
  compDecibelVolume: competition = competition.DecibelVolume;
  compDecibelShow: competition = competition.DecibelShow;
  compDecibelbattle: competition = competition.DecibelBattleQualy;

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
    this.ClearResults();
    this.classleft = this._FactoryService.getNewCompetitionClass();
    this.classright = this._FactoryService.getNewCompetitionClass();
    this.currentevent = this._FactoryService.getnewEvent();
    this._CurrentdataService.getEvent().subscribe(item => {
      this.currentevent = item;
      this._ParticipantsService.setidcurrenevent(this.currentevent.id)
    });
    this._CurrentdataService.getCompetition().subscribe(item => {
      this.currentcompetition = item;
      this.onChangecompetition(item);
      this.ClearResults();
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
    this.currentparticipant2.push(this.clearparticipant);

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
      else if (this.currentcompetition == competition.DecibelBattleQualy) {
        return participants.isDecibelBattle
      }
      else if (this.currentcompetition == competition.DecibelLeague) {
        return participants.isDecibelLeague
      }
      return false
      })
    });
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
        this.classleft = this.participantleft == undefined ? _clearclass: this.participantleft.classDecibelShow;
        this.classright = this.participantright == undefined ? _clearclass: this.participantright.classDecibelShow
      } else if (this.currentcompetition == competition.DecibelVolume) {
        this.classleft = this.participantleft == undefined ? _clearclass: this.participantleft.classDecibelVolume;
        this.classright = this.participantright == undefined ? _clearclass: this.participantright.classDecibelVolume
      } else if (this.currentcompetition == competition.DecibelBattleQualy) {
        this.classleft = this.participantleft == undefined ? _clearclass: this.participantleft.classDecibelBattle;
        this.classright = this.participantright == undefined ? _clearclass: this.participantright.classDecibelBattle
      } else if (this.currentcompetition == competition.DecibelLeague) {
        this.classleft = this.participantleft == undefined ? _clearclass: this.participantleft.classDecibelLeague;
        this.classright = this.participantright == undefined ? _clearclass: this.participantright.classDecibelLeague
      }
    }
  }

  ClearResults() {

    this.resultlefttop = this._FactoryService.getNewResult(this.currentcompetition, this.classleft);
    this.resultleft2 = this._FactoryService.getNewResult(this.currentcompetition, this.classleft);
    this.currentresultleft = this._FactoryService.getNewResult(this.currentcompetition, this.classleft);
    this.currentresultright = this._FactoryService.getNewResult(this.currentcompetition, this.classright);
    this.resultrighttop = this._FactoryService.getNewResult(this.currentcompetition, this.classright);
    this.resultright2 = this._FactoryService.getNewResult(this.currentcompetition, this.classright);
    if (this.currentevent !== undefined) {
      this.participantleft = this._FactoryService.getnewParticipantclass(this.currentevent.id);
      this.ControlLeft.reset();
      this.participantright = this._FactoryService.getnewParticipantclass(this.currentevent.id);
      this.ControlRight.reset();
    }
    /*this._CurrentdataService.setCurrentParticipant1(this.clearparticipant);
    this._CurrentdataService.setCurrentParticipant2(this.clearparticipant);
    this._CurrentdataService.setCurrentResult1(this._FactoryService.getNewResult());
    this._CurrentdataService.setCurrentResult2(this._FactoryService.getNewResult());*/

  }

  SaveResults() {
    this._ParticipantsService.generateResult(this.currentresultleft, this.participantleft, this.currentcompetition);

    this._ParticipantsService.generateResult(this.currentresultright, this.participantright, this.currentcompetition);

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
      else if (this.currentcompetition == competition.DecibelBattleQualy) {
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
        this.participantright.classDecibelLeague = _event;
      }
      else if (this.currentcompetition == competition.DecibelBattleQualy) {
        this.participantright.classDecibelBattle = _event;
      }
      else if (this.currentcompetition == competition.DecibelVolume) {
        this.participantright.classDecibelVolume = _event;
      }
      else if (this.currentcompetition == competition.DecibelShow) {
        this.participantright.classDecibelShow = _event;
      }
      this._ParticipantsService.setParticipant(this.participantright);
    }
  }

  onChangeResults(left: boolean, _result: result) {
    if (this.currentcompetition == competition.DecibelShow) {
      _result.result = +_result.sub + _result.front;
      _result.result.toFixed(2);
    }
    if (left) {
      if (this.resultlefttop.checkin && this.resultleft2.checkin) {
        this.currentresultleft.result = Math.max(this.resultlefttop.result, this.resultleft2.result);
        if (this.currentresultleft.result == this.resultlefttop.result && this.resultlefttop.checkin) {
          this.currentresultleft.outputpower = this.resultlefttop.outputpower;
          this.currentresultleft.front = this.resultlefttop.front;
          this.currentresultleft.sub = this.resultlefttop.sub;
        }
        else if (this.currentresultleft.result == this.resultleft2.result && this.resultleft2.checkin) {
          this.currentresultleft.outputpower = this.resultleft2.outputpower;
          this.currentresultleft.front = this.resultleft2.front;
          this.currentresultleft.sub = this.resultleft2.sub;
        }
        else {
          this.currentresultleft.outputpower = "";
          this.currentresultleft.front = 0;
          this.currentresultleft.sub = 0;
        }
      }
      else if (this.resultlefttop.checkin) {
        this.currentresultleft.result = this.resultlefttop.result;
        this.currentresultleft.outputpower = this.resultlefttop.outputpower;
        this.currentresultleft.front = this.resultlefttop.front;
        this.currentresultleft.sub = this.resultlefttop.sub;
      }
      else if (this.resultleft2.checkin) {
        this.currentresultleft.result = this.resultleft2.result;
        this.currentresultleft.outputpower = this.resultleft2.outputpower;
        this.currentresultleft.front = this.resultleft2.front;
        this.currentresultleft.sub = this.resultleft2.sub;
      }
      else {
        this.currentresultleft.result = 0;
        this.currentresultleft.outputpower = "";
        this.currentresultleft.front = 0;
        this.currentresultleft.sub = 0;
      }
    }
    else {
      if (this.resultrighttop.checkin && this.resultright2.checkin) {
        this.currentresultright.result = Math.max(this.resultrighttop.result, this.resultright2.result);
        if (this.currentresultright.result == this.resultrighttop.result && this.resultrighttop.checkin) {
          this.currentresultright.outputpower = this.resultrighttop.outputpower;
          this.currentresultright.front = this.resultrighttop.front;
          this.currentresultright.sub = this.resultrighttop.sub;
        }
        else if (this.currentresultright.result == this.resultright2.result && this.resultright2.checkin) {
          this.currentresultright.outputpower = this.resultright2.outputpower;
          this.currentresultright.front = this.resultright2.front;
          this.currentresultright.sub = this.resultright2.sub;
        }
        else {
          this.currentresultright.outputpower = "";
          this.currentresultright.front = 0;
          this.currentresultright.sub = 0;
        }
      }
      else if (this.resultrighttop.checkin) {
        this.currentresultright.result = this.resultrighttop.result;
        this.currentresultright.outputpower = this.resultrighttop.outputpower;
        this.currentresultright.front = this.resultrighttop.front;
        this.currentresultright.sub = this.resultrighttop.sub;
      }
      else if (this.resultright2.checkin) {
        this.currentresultright.result = this.resultright2.result;
        this.currentresultright.outputpower = this.resultright2.outputpower;
        this.currentresultright.front = this.resultright2.front;
        this.currentresultright.sub = this.resultright2.sub;
      }
      else {
        this.currentresultright.result = 0;
        this.currentresultright.outputpower = "";
        this.currentresultright.front = 0;
        this.currentresultright.sub = 0;
      }
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
