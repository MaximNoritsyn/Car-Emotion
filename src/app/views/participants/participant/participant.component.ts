import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {participant, ParticipantsService} from '../../../services/participants.service';
import {Translate_Service} from '../../../services/translate.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  currentParticipant: participant;
  private createnew: boolean;

  constructor(private _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private translate_service: Translate_Service) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {

    if (params["keyparticipant"] = null) (

    this.currentParticipant = this._ParticipantsService.getnewParticipantclass())
      else
      (console.log(params["keyparticipant"]))
    }
    )
  }

  setParticipant() {
    this._ParticipantsService.setParticipant(this.currentParticipant)
  }

}
