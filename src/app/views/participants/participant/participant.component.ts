import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {participant, ParticipantsService} from '../../../services/participants.service';
import {Translate_Service} from '../../../services/translate.service';
import {Observable} from 'rxjs/Rx';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  currentParticipant: participant;
  test: Observable<participant>;

  constructor(private _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private translate_service: Translate_Service)
  {
    this.currentParticipant = this._ParticipantsService.getnewParticipantclass();
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) =>
    {

    if (params["keyparticipant"] == null)
      {
        this.currentParticipant = this._ParticipantsService.getnewParticipantclass()
      }
    else
      {
        this.test = this._ParticipantsService.getParticipant(params["keyparticipant"]);
      this.test.subscribe(item => this.currentParticipant = item)
        //.subscribe(items => {
        //return items.map(item => item.key);
      //})
      };
    }
    )
  }

    setParticipant() {
    this._ParticipantsService.setParticipant(this.currentParticipant)
  }

}
