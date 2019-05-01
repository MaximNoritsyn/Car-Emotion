import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EventsService} from '../../../services/events.service';
import {Translate_Service} from '../../../services/translate.service';
import {competition, competitionclass} from '../../../interfaces/app.interface';
import {arraycompetition, FactoryService} from '../../../services/factory.service';

@Component({
  selector: 'app-competitionclass',
  templateUrl: './competitionclass.component.html',
  styleUrls: ['./competitionclass.component.css']
})
export class CompetitionclassComponent implements OnInit {

  private currentClass: competitionclass;
  private arrayCompetitons: competition[] = arraycompetition;

  constructor(private _auth: AuthService,
              private router: Router,
              private _EventsService: EventsService,
              private activeRoute: ActivatedRoute,
              private translate_service: Translate_Service,
              private _FactoryService: FactoryService) {

  }

  ngOnInit() {
    this.currentClass = this._FactoryService.getNewCompetitionClass();
    this.activeRoute.params.subscribe((params: Params) =>
    { if (params["idclass"] !== null && params["idclass"] !== undefined)
      {
        this._EventsService.getCompetitionClassObs(params["idclass"]).subscribe(item =>
        {this.currentClass = item})
      }
    })
  }

  SetCompetitionClass() {
    this._EventsService.setCompetitionClass(this.currentClass);
    this.router.navigate(['/adminboard'])
  }

  selectedcompetition(competitionel: any, currentcompetitionel: any) {
    return competitionel == currentcompetitionel;
  }

}
