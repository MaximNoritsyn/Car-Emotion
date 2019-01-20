import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {competitionclass, event, participant, point, season} from '../../interfaces/app.interface';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  seasons: Observable<season[]>;
  currentseason: Observable<season>;
  events: Observable<event[]>;

  participants: Observable<participant[]>;

  constructor(private authService: AuthService,
              private router: Router,
              private _EventsService: EventsService) { }

  ngOnInit() {
    this.seasons = this._EventsService.getSeasons();
  }

  editSeason() {
    //this.router.navigate(['season']);
    console.log(this.currentseason);
  }

  addSeason() {
    this.router.navigate(['season']);
  }

  setNewSeason(season: season)
  {
    console.log(season)
  }


}
