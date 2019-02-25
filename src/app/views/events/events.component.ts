import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {event, participant, season} from '../../interfaces/app.interface';
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

  seasonsObs: Observable<season[]>;
  seasons: season[];
  currentseasonObs: Observable<season>;
  currentseason: season;
  events: Observable<event[]>;

  participants: Observable<participant[]>;

  constructor(private authService: AuthService,
              private router: Router,
              private _CurrentdataService: CurrentdataService,
              private _EventsService: EventsService) {}

  ngOnInit() {
    this.currentseason = this._CurrentdataService.getseason();
    this.seasonsObs = this._EventsService.getSeasons();
    this.seasonsObs.subscribe(items => {
      this.seasons = items;
      if (this.currentseason.id == "") {
        this.currentseason = this._CurrentdataService.getseason()
      };
    });
  }

  setCurrentSeason(season: season)
  {
    this._CurrentdataService.setcashseason(season);
    this.currentseason = season;
  }

  selectedseason(seasonel, currentseasonel) {
    return seasonel.id == currentseasonel.id;
  }


}
