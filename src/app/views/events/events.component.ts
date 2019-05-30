import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {event, season} from '../../interfaces/app.interface';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {EventsService} from '../../services/events.service';
import {CurrentdataService} from '../../services/currentdata.service';
import {MatNativeDateModule} from '@angular/material';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  seasonsObs: Observable<season[]>;
  seasons: season[];
  currentseason: season;
  eventsObs: Observable<event[]>;
  events: event[];

  constructor(public _auth: AuthService,
              private router: Router,
              private _CurrentdataService: CurrentdataService,
              private _EventsService: EventsService) {}

  ngOnInit() {

    //season
    this.currentseason = this._CurrentdataService.getseason();
    this.seasonsObs = this._EventsService.getSeasons();
    this.seasonsObs.subscribe(items => {
      this.seasons = items;
      if (this.currentseason.id == "") {
        this.currentseason = this._CurrentdataService.getseason()
      }
    });


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
        if (items !== null && (this.currentseason !== undefined && this.currentseason.id !== "")) {
          this.events = items.filter(options => options.season.id == this.currentseason.id)
        }
          else {
            this.events = items;
          }
        })
  }
}

