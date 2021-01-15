import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {competitionclass, event, participant, season} from '../../interfaces/app.interface';
import {EventsService} from '../../services/events.service'
import {Translate_Service} from '../../services/translate.service';
import {ParticipantsService} from '../../services/participants.service';

@Component({
  selector: 'app-adminboard',
  templateUrl: './adminboard.component.html',
  styleUrls: ['./adminboard.component.css']
})
export class AdminboardComponent implements OnInit {

  public CompetitionClasses: competitionclass[];
  public seasons: season[];
  public events: event[];

  constructor(public _auth: AuthService,
              private router: Router,
              private _EventsService: EventsService,
              private _ParticipantsService: ParticipantsService,
              private translate_service: Translate_Service) { }

  ngOnInit() {
    this._EventsService.getCompetitionClassesObs().subscribe(items => this.CompetitionClasses = items)
    this._EventsService.getSeasons().subscribe(items => this.seasons = items);
    this._EventsService.getEvents().subscribe( items => {
      this.events = items.sort((a, b) => a.startDate > b.startDate ? -1 : a.startDate < b.startDate ? 1 : 0);
    })

  }

  countAllResults() {
    this._ParticipantsService.countAllResults();
    this._EventsService.getEventsOnce().then(
      resultevents => {
        resultevents.forEach(_event => {
          let localevent: event = _event.val() as event;
          this._EventsService.updateEvent(localevent)
          }
        )
      }
    )
  }

  changeUidOfPerson() {
    this._ParticipantsService.duty_inputUserUid();
    this._ParticipantsService.duty_inputIdParticipant();
  }

}
