import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FactoryService} from '../../../services/factory.service';
import {Translate_Service} from '../../../services/translate.service';
import {CurrentdataService} from '../../../services/currentdata.service';
import {competition, competitionclass, event, participant, person} from '../../../interfaces/app.interface';
import {ParticipantsService} from '../../../services/participants.service';
import {EventsService} from '../../../services/events.service';
import {consoleTestResultHandler} from 'tslint/lib/test';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  currentperson: person;
  edit: boolean;

  public editclass: boolean = false;
  public beginreestration: boolean = false;

  currentevent: event;
  currentparticipant: participant;

  private arrayclassDecibelLeague: competitionclass[];
  private arrayclassDecibelBattle: competitionclass[];
  private arrayclassDecibelShow: competitionclass[];
  private arrayclassDecibelVolume: competitionclass[];
  private arrayclassDecibelShow2020: competitionclass[];
  private arrayclassDecibelVolume2020: competitionclass[];

  constructor(public _auth: AuthService,
              private router: Router,
              private _EventsService: EventsService,
              private activeRoute: ActivatedRoute,
              private _FactoryService: FactoryService,
              private _ParticipantsService: ParticipantsService,
              public translate_service: Translate_Service,
              private _CurrentdataService: CurrentdataService) { }

  ngOnInit() {

    this.currentparticipant = this._FactoryService.getnewParticipantclass("");

    if (this._auth.isAdministrator()) {
      this.activeRoute.params.subscribe((params: Params) => {
          if (params['idperson'] !== null && params['idperson'] !== undefined) {
            this._ParticipantsService.getPerson(params['idperson']).subscribe(item => {
                this.currentperson = item as person;
                this.currentparticipant.person = this.currentperson;
              }
            )
          }
        }
      )
    }
    else {
      this.currentperson = this._FactoryService.getnewPerson();
      this._auth.getPersonOfCurrentUser().subscribe(
        person => {
          this.currentperson = person;
          this.currentparticipant.person = this.currentperson;
        }
      );
    }

    this.currentevent = this._FactoryService.getnewEvent();
    this._CurrentdataService.getCurrentEventOnce().then(
      event =>
      {
        this._EventsService.getEvent(event.val().id).subscribe(
          realevent => {
            this.currentevent = realevent;
            this.currentparticipant.idevent = this.currentevent.id;
          }
        )
      }
    );

    this._EventsService.getCompetitionClassesObs().subscribe(items => {
      this.arrayclassDecibelBattle = this._EventsService.getCompetitionClasses(items, competition.DecibelBattleQualy);
      this.arrayclassDecibelLeague = this._EventsService.getCompetitionClasses(items, competition.DecibelLeague);
      this.arrayclassDecibelShow = this._EventsService.getCompetitionClasses(items, competition.DecibelShow);
      this.arrayclassDecibelVolume = this._EventsService.getCompetitionClasses(items, competition.DecibelVolume);
      this.arrayclassDecibelShow2020 = this._EventsService.getCompetitionClasses(items, competition.DecibelShow2020);
      this.arrayclassDecibelVolume2020 = this._EventsService.getCompetitionClasses(items, competition.DecibelVolume2020);
    });
  }

  editMode() {
    return this.edit;
  }

  haveInsta(): boolean {
    return this.currentperson.insta !== "";
  }

  savePerson() {
    this._ParticipantsService.setPerson(this.currentperson)
  }

  enableEdit() {
    this.edit = true
  }

  isOpenevent() {
    return this.currentevent.id !== "";
  }

  DisableParticipant() {
    return !(this.isNew() || this.edit) || this._auth.isAdministrator();
  }

  isNew(): boolean {
    return this.currentparticipant.id == "";
  }

  setParticipant() {
    this.currentparticipant.idevent = this.currentevent.id;
    this._ParticipantsService.setParticipant(this.currentparticipant);
    this.edit = false;
  }

  selectedid(classel: any, currentclassel: any) {
    if (classel == undefined || currentclassel == undefined) {
      return false;
    }
    return classel.id == currentclassel.id;
  }

  setBeginReestration() {
    this.beginreestration = true;
  }

  beginReestration() {
    return (this.beginreestration && this.isNew()) || !this.isNew();
  }

}
