import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {competitionclass, season} from '../../interfaces/app.interface';
import {EventsService} from '../../services/events.service'
import {Translate_Service} from '../../services/translate.service';

@Component({
  selector: 'app-adminboard',
  templateUrl: './adminboard.component.html',
  styleUrls: ['./adminboard.component.css']
})
export class AdminboardComponent implements OnInit {

  private CompetitionClasses: competitionclass[];
  private seasons: season[];

  constructor(private _auth: AuthService,
              private router: Router,
              private _EventsService: EventsService,
              private translate_service: Translate_Service) { }

  ngOnInit() {
    this._EventsService.getCompetitionClassesObs().subscribe(items => this.CompetitionClasses = items)
    this._EventsService.getSeasons().subscribe(items => this.seasons = items);

  }

}
