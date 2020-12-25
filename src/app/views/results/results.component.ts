import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../services/participants.service';
import {CurrentdataService} from '../../services/currentdata.service';
import {arraycompetition, FactoryService} from '../../services/factory.service';
import {EventsService} from '../../services/events.service';
import {competition, competitionclass, event, person, result} from '../../interfaces/app.interface';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  currentevent: event;
  results: result[];
  classes: competitionclass[];

  compDecibelLeague: competition = competition.DecibelLeague;
  compDecibelVolume: competition = competition.DecibelVolume;
  compDecibelShow: competition = competition.DecibelShow;
  compDecibelVolume2020: competition = competition.DecibelVolume2020;
  compDecibelShow2020: competition = competition.DecibelShow2020;
  compDecibelbattle: competition = competition.DecibelBattleQualy;

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private _CurrentdataService: CurrentdataService,
              private _FactoryService: FactoryService,
              private _EventsService: EventsService) { }

  ngOnInit() {
    this._EventsService.getCompetitionClassesObs().subscribe(items =>
    this.classes = items);
    this.activeRoute.params.subscribe((params: Params) => {
        if (params["idevent"] !== null && params["idevent"] !== undefined) {
          this._EventsService.getEvent(params["idevent"]).subscribe(item => {
            this.currentevent = item;
            this._ParticipantsService.getResultssOfEvent(this.currentevent.id)
              .subscribe(items => this.results = items)
          });
        }
        else {
          this._CurrentdataService.getEvent().subscribe(item => {
            this.currentevent = item;
            this._ParticipantsService.getResultssOfEvent(this.currentevent.id)
              .subscribe(items => this.results = items)
          });
        }
      }
    )



  }

  getCompetitionClasses(localcompetition: competition): competitionclass[] {
    return this._EventsService.getCompetitionClasses(this.classes, localcompetition);
  }

  getResultsOfClass(idclass:string) {
    return this._ParticipantsService.getResultsClasses(this.results, idclass);
  }

}
