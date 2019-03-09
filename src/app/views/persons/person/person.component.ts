import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../../services/participants.service';
import {person} from '../../../interfaces/app.interface';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  currentperson: person;

  constructor(private authService: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService) { }

  ngOnInit() {
    this.currentperson = this._ParticipantsService.getnewPerson();
    this.activeRoute.params.subscribe((params: Params) => {
      if (params["idperson"] !== null && params["idperson"] !== undefined) {
        this._ParticipantsService.getPerson(params["idperson"]).subscribe(item => {
          this.currentperson = item})
        }
      }
    )
  }


}
