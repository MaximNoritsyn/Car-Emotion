import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../../services/participants.service';
import {competition, person, result} from '../../../interfaces/app.interface';
import {FactoryService} from '../../../services/factory.service';
import {__rest} from 'tslib';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  public currentperson: person;

  public results: result[];

  public bestDecibelleague: result;
  public bestDecibelShow: result;
  public bestDecibelVolume: result;

  constructor(private authService: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private _FactoryService: FactoryService) { }

  ngOnInit() {
    this.bestDecibelleague = undefined;
    this.bestDecibelShow = undefined;
    this.bestDecibelVolume = undefined;
    this.currentperson = this._FactoryService.getnewPerson();
    this.activeRoute.params.subscribe((params: Params) => {
      if (params["idperson"] !== null && params["idperson"] !== undefined) {
        this._ParticipantsService.getPerson(params["idperson"]).subscribe(item => {
          this.currentperson = item;
          this._ParticipantsService.getBestResultsOfPerson(competition.DecibelLeague, this.currentperson.id).subscribe( _tabres =>
          {
            _tabres.forEach(_res => this.bestDecibelleague = _res);
          });
          this._ParticipantsService.getBestResultsOfPerson(competition.DecibelVolume, this.currentperson.id).subscribe( _tabres =>
          {
            _tabres.forEach(_res => this.bestDecibelVolume = _res)
          });
          this._ParticipantsService.getBestResultsOfPerson(competition.DecibelShow, this.currentperson.id).subscribe( _tabres =>
          {
            _tabres.forEach(_res => this.bestDecibelShow = _res)
          });
            this._ParticipantsService.getResultssOfPerson(this.currentperson.id).subscribe( _tabres =>
            this.results = _tabres);
        }
        )
      }
    }
    )
  }

  deisplayBestLeague() {
    return this.bestDecibelleague !== undefined;
  }

  deisplayBestVolume() {
    return this.bestDecibelVolume !== undefined;
  }

  deisplayBestShow() {
    return this.bestDecibelShow !== undefined;
  }

}
