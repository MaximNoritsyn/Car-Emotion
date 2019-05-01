import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EventsService} from '../../../services/events.service';
import {Observable} from 'rxjs/Rx';
import {season, team} from '../../../interfaces/app.interface';
import {CurrentdataService} from '../../../services/currentdata.service';
import {FactoryService} from '../../../services/factory.service';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.css']
})
export class SeasonComponent implements OnInit {

  public currentseason: season;
  private season: Observable<season>;
  public teams: team[];

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _CurrentdataService: CurrentdataService,
              private _EventsService: EventsService,
              private _FactoryService: FactoryService) { }

  ngOnInit() {
    this.currentseason = this._FactoryService.getnewSeason();
    this.activeRoute.params.subscribe((params: Params) =>
    {
      if ((params["idseason"] == null && params["idseason"] == undefined) == false)
      {
        this.season = this._EventsService.getSeason(params["idseason"]);
        this.season.subscribe(item => {this.currentseason = item});
        this._EventsService.getTeams(params["idseason"]).subscribe( items =>
        this.teams = items)
      }
    }
    )
  }

  setSeason() {
    this._EventsService.setSeason(this.currentseason)
  }

  setcurrentSeason() {
    this._CurrentdataService.setseason(this.currentseason);
  }

}
