import {Component, OnInit} from '@angular/core';
import {event, eventstatus, season} from '../../../interfaces/app.interface';
import {Observable} from 'rxjs/Rx';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CurrentdataService} from '../../../services/currentdata.service';
import {EventsService} from '../../../services/events.service';
import {ParticipantsService} from '../../../services/participants.service';
import {arraystatuses, FactoryService} from '../../../services/factory.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  seasonsObs: Observable<season[]>;
  seasons: season[];
  currentevent: event;
  private eventObs: Observable<event>;
  arraystatuseslocal: eventstatus[] = arraystatuses;
  eventstatus = eventstatus;

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private _CurrentdataService: CurrentdataService,
              private _FactoryService: FactoryService,
              private _EventsService: EventsService) { }

  ngOnInit() {
    this.currentevent = this._FactoryService.getnewEvent();
    this._ParticipantsService.setidcurrenevent(this.currentevent.id);
    this.activeRoute.params.subscribe((params: Params) =>
      {
        if ((params["idevent"] == null && params["idevent"] == undefined) == false)
        {
          this.eventObs = this._EventsService.getEvent(params["idevent"]);
          this.eventObs.subscribe(item => {
            this.currentevent = item;
            this._ParticipantsService.setidcurrenevent(this.currentevent.id)
          });
        }
      }
    );
    this.seasonsObs = this._EventsService.getSeasons();
    this.seasonsObs.subscribe(items => {
      this.seasons = items;
    });
  }

  setEvent() {
    this._EventsService.setEvent(this.currentevent);
    this._ParticipantsService.setidcurrenevent(this.currentevent.id);
    this.router.navigate(['/events'])
  }

  selectedseason(seasonel: any, currentseasonel: any) {
    return seasonel.id == currentseasonel.id;
  }

  selectedstatus(statusel: any, currentstatusel: any) {
    return statusel == currentstatusel;
  }

}
