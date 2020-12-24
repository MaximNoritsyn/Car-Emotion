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

  constructor(public _auth: AuthService,
              private router: Router,
              private _EventsService: EventsService,
              private _ParticipantsService: ParticipantsService,
              private translate_service: Translate_Service) { }

  ngOnInit() {
    this._EventsService.getCompetitionClassesObs().subscribe(items => this.CompetitionClasses = items)
    this._EventsService.getSeasons().subscribe(items => this.seasons = items);

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

  changeUid() {
    this._ParticipantsService.inputUserUid();
  }

}
