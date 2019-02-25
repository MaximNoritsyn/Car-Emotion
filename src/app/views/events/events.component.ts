import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {event, participant, season} from '../../interfaces/app.interface';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {EventsService} from '../../services/events.service';
import {CurrentdataService} from '../../services/currentdata.service';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  seasonsObs: Observable<season[]>;
  seasons: season[];
  currentseasonObs: Observable<season>;
  currentseason: season;
  eventsObs: Observable<event[]>;
  events: event[];

  constructor(private authService: AuthService,
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
      };
    });


    //event
    this.eventsObs = this._EventsService.getEvets();
    this.fillevents();

  }

  setCurrentSeason(season: season)
  {
    this._CurrentdataService.setcashseason(season);
    this.currentseason = season;
    this.fillevents();
  }

  selectedseason(seasonel, currentseasonel) {
    return seasonel.id == currentseasonel.id;
  }

  fillevents() {
    this.eventsObs.subscribe( items => {

        if (items !== null && (this.currentseason !== undefined && this.currentseason.id !== ""))
        {
          let idseaseon = this.currentseason.id;
          let localevents: event[] = [];
          items.forEach(function (event) {
              if (event.season.id == idseaseon) {
                localevents.push(event)
              }
            }
          )
          this.events = localevents;
        }
      }
    )

  }


}
