import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../../services/participants.service';
import {CurrentdataService} from '../../../services/currentdata.service';
import {FactoryService} from '../../../services/factory.service';
import {EventsService} from '../../../services/events.service';
import {competition, result} from '../../../interfaces/app.interface';

@Component({
  selector: 'app-totalresults',
  templateUrl: './totalresults.component.html',
  styleUrls: ['./totalresults.component.css']
})
export class TotalresultsComponent implements OnInit {

  results: result[];

  currentCompetition: competition;

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private _CurrentdataService: CurrentdataService,
              private _FactoryService: FactoryService,
              private _EventsService: EventsService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      if (params['competetion'] == 'DecibelLeague') {
        this._ParticipantsService.getBestResultssOfCompetition(competition.DecibelLeague).subscribe(items =>
          this.results = items);
        this.currentCompetition = competition.DecibelLeague;
      } else if (params['competetion'] == 'DecibelShow') {
        this._ParticipantsService.getBestResultssOfCompetition(competition.DecibelShow).subscribe(items =>
          this.results = items);
        this.currentCompetition = competition.DecibelShow;
      } else if (params['competetion'] == 'DecibelShow2020') {
        this._ParticipantsService.getBestResultssOfCompetition(competition.DecibelShow).subscribe(items =>
          this.results = items);
        this.currentCompetition = competition.DecibelShow2020;
      } else if (params['competetion'] == 'DecibelVolume2020') {
        this._ParticipantsService.getBestResultssOfCompetition(competition.DecibelShow).subscribe(items =>
          this.results = items);
        this.currentCompetition = competition.DecibelVolume2020;
      } else if (params['competetion'] == 'DecibelVolume') {
        this._ParticipantsService.getBestResultssOfCompetition(competition.DecibelVolume).subscribe(items =>
          this.results = items);
        this.currentCompetition = competition.DecibelVolume;
      } else {
        this.results = [];
        this.currentCompetition = null;
      }
    }
  )
  }

  cityres(_result: result): string {
    if (_result.event == undefined) {
      return ""
    }
    else {
      return _result.event.location
    }
  }

  dateres(_result: result): string {
    if (_result.event == undefined) {
      return ""
    }
    else {
      return _result.event.startDate.toString();
    }
  }

  isDecibelLeague() {
    return this.currentCompetition == competition.DecibelLeague;
  }

  isDecibelShow() {
    return this.currentCompetition == competition.DecibelShow;
  }

  isSomeComp() {
    return this.currentCompetition !== null;
  }

}
