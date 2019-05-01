import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ParticipantsService} from '../../services/participants.service';
import { Observable } from 'rxjs';
import {participant} from '../../interfaces/app.interface';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  participantsObs: Observable<participant[]>;
  participants: participant[];
  idevent: string = "";

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService) { }

  ngOnInit() {

    this.activeRoute.params.subscribe((params: Params) =>
    {
      this.idevent = params["idevent"];
      this._ParticipantsService.setidcurrenevent(this.idevent);
      this._ParticipantsService.getParticipants().subscribe(items => {
        this.participants = items;
      })
    })
  }



}
