import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EventsService} from '../../../services/events.service';
import {Observable} from 'rxjs/Rx';
import {season} from '../../../interfaces/app.interface';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.css']
})
export class SeasonComponent implements OnInit {

  currentseason: season;
  private season: Observable<season>;

  constructor(private _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _EventsService: EventsService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) =>
    {
      if (params["id"] == null)
      {
        this.currentseason = this._EventsService.getnewSeason();
        console.log(this.currentseason);
      }
      else {
        this.season = this._EventsService.getSeason(params["id"]);
        this.season.subscribe(item => this.currentseason = item)
      }
    }
    )
  }

  setSeason() {
    this._EventsService.setSeason(this.currentseason)
  }

}
