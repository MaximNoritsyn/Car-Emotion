import { Component, OnInit } from '@angular/core';
import {event, eventstatus, season} from '../../../interfaces/app.interface';
import {Observable} from 'rxjs/Rx';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CurrentdataService} from '../../../services/currentdata.service';
import {EventsService} from '../../../services/events.service';

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
  statuses: eventstatus[];

  constructor(private _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _CurrentdataService: CurrentdataService,
              private _EventsService: EventsService) { }

  ngOnInit() {
    this.currentevent = this._EventsService.getnewEvent();
    this.activeRoute.params.subscribe((params: Params) =>
      {
        if ((params["id"] == null && params["id"] == undefined) == false)
        {
          this.eventObs = this._EventsService.getEvent(params["id"]);
          this.eventObs.subscribe(item => {this.currentevent = item});
        }
      }
    )
    //this.currentseason = this._CurrentdataService.getseason();
    this.seasonsObs = this._EventsService.getSeasons();
    this.seasonsObs.subscribe(items => {
      this.seasons = items;
    });
    //this.statuses.
  }

  setEvent() {
    this._EventsService.setEvent(this.currentevent)
  }

  selectedseason(seasonel, currentseasonel) {
    return seasonel.id == currentseasonel.id;
  }

  selectedstatus(statusel, currentstatusel) {
    return statusel == currentstatusel;
  }

}
