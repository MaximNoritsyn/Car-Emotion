import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {event, eventstatus, season} from '../../interfaces/app.interface';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {EventsService} from '../../services/events.service';
import {CurrentdataService} from '../../services/currentdata.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {

  currentseason: season;
  eventsObs: Observable<event[]>;
  events: event[];
  eventstatus = eventstatus;

  constructor(public _auth: AuthService,
              private router: Router,
              private _CurrentdataService: CurrentdataService,
              private _EventsService: EventsService) {}

  ngOnInit() {

    //season
    this.currentseason = this._CurrentdataService.getseason();

    //event
    this.eventsObs = this._EventsService.getEvents();
    this.fillevents();

  }

  setCurrentSeason(season: season)
  {
    this._CurrentdataService.setcashseason(season);
    this.currentseason = season;
    this.fillevents();
  }

  selectedseason(seasonel: any, currentseasonel: any) {
    return seasonel.id == currentseasonel.id;
  }

  fillevents() {
    this.eventsObs.subscribe( items => {
      this.events = items.sort((a, b) => a.startDate > b.startDate ? -1 : a.startDate < b.startDate ? 1 : 0);
        })
  }
}

