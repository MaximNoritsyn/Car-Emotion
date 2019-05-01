import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Translate_Service} from '../../services/translate.service';
import {EventsService} from '../../services/events.service';
import {team} from '../../interfaces/app.interface';
import {FactoryService} from '../../services/factory.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  idseason: string;
  currentteam: team;

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private translate_service: Translate_Service,
              private _EventsService: EventsService,
              private _FactoryService: FactoryService) {  }


  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) =>
    {
      this.idseason = params["idseason"];
      this.currentteam = this._FactoryService.getNewTeam();
      if (params["idteam"] !== null && params["idteam"] !== undefined)
      {
        this._EventsService.getTeam(this.idseason, params["idteam"]).subscribe(item =>
          this.currentteam = item)
      };
    })
  }

  setTeam() {
    this._EventsService.setTeam(this.idseason, this.currentteam);
    this.router.navigate(['/season/' + this.idseason]);
  }

}
