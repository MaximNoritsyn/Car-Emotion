import { Component, OnInit } from '@angular/core';
import {competition, competitionclass, event, participant, point} from '../../interfaces/app.interface';
import {Observable} from 'rxjs/Rx';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../services/participants.service';
import {CurrentdataService} from '../../services/currentdata.service';
import {FactoryService} from '../../services/factory.service';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent implements OnInit {

  currentevent: event;
  private eventObs: Observable<event>;
  copmetitionclasses: competitionclass[];
  points: point[];

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private _CurrentdataService: CurrentdataService,
              private _FactoryService: FactoryService,
              private _EventsService: EventsService) { }

  ngOnInit() {

    this._EventsService.getCompetitionClassesObs().subscribe(items =>
      this.copmetitionclasses = items
    )

    this.activeRoute.params.subscribe((params: Params) =>
      {
        if ((params["idevent"] == null && params["idevent"] == undefined) == false)
        {
          this.eventObs = this._EventsService.getEvent(params["idevent"]);
          this.eventObs.subscribe(item => {
            this.currentevent = item;
            this._ParticipantsService.getPointsOfEvent(this.currentevent.id).subscribe( items =>
              this.points = items
            )
            this._ParticipantsService.setidcurrenevent(this.currentevent.id)
          });
        }
      }
    );
  }

  getPointwithFilter(_competitionclass: competitionclass): point[] {

    return this.points.filter(item => {
     return item.idclass == _competitionclass.id
    }
    )

  }

  getparticipant(_partcipant: participant, id: string){
    return this._ParticipantsService.getParticipant(id).subscribe(item =>
      _partcipant = item
    )
  }

  getnewParticipantclass(): participant {
    return this._FactoryService.getnewParticipantclass(this.currentevent.id);
  }

}
