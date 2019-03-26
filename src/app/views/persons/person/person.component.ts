import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../../services/participants.service';
import {person} from '../../../interfaces/app.interface';
import {FactoryService} from '../../../services/factory.service';

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
              private _ParticipantsService: ParticipantsService,
              private _FactoryService: FactoryService) { }

  ngOnInit() {
    this.currentperson = this._FactoryService.getnewPerson();
    this.activeRoute.params.subscribe((params: Params) => {
      if (params["idperson"] !== null && params["idperson"] !== undefined) {
        this._ParticipantsService.getPerson(params["idperson"]).subscribe(item => {
          this.currentperson = item})
        }
      }
    )
  }


}
