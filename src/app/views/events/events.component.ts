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

  seasons: Observable<season[]>;
  currentseasonObs: Observable<season>;
  currentseason: season;
  events: Observable<event[]>;

  participants: Observable<participant[]>;

  constructor(private authService: AuthService,
              private router: Router,
              private _CurrentdataService: CurrentdataService,
              private _EventsService: EventsService) {}

  ngOnInit() {
    this.currentseason = this._EventsService.getnewSeason();
    this.seasons = this._EventsService.getSeasons();
    this.currentseasonObs = this._CurrentdataService.getseason();
    this.currentseasonObs.subscribe(item => this.currentseason = item)
  }

  editSeason() {
    this.router.navigate(['season/' + this.currentseason.id] );
  }

  addSeason() {
    this.router.navigate(['season']);
  }

  setNewSeason(season: season)
  {
    this.currentseason = season;
    //this._CurrentdataService.setseason(season);
  }


}
