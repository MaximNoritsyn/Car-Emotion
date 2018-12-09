import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {participant, ParticipantsService} from '../../../services/participants.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  currentParticipant: participant;
  private createnew: boolean;

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {

    if (params["keyparticipant"] = null) (

    this.currentParticipant = new class implements participant {
      city: string = "";
      email: string = "";
      familyName: string = "";
      $key: string;
      name: string = "";
      telephone: string = "";
    })
    else

      (this._ParticipantsService.getParticipant(params["keyparticipant"]).subscribe(snapshot => {
        console.log(snapshot)
        this.currentParticipant = snapshot
      }))

  })}

  setParticipant() {
    this._ParticipantsService.setParticipant(this.currentParticipant)
  }

}
