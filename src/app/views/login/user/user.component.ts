import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FactoryService} from '../../../services/factory.service';
import {Translate_Service} from '../../../services/translate.service';
import {CurrentdataService} from '../../../services/currentdata.service';
import {competition, event, person} from '../../../interfaces/app.interface';
import {ParticipantsService} from '../../../services/participants.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  currentperson: person;
  edit: boolean;

  currentevent: event;

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _FactoryService: FactoryService,
              private _ParticipantsService: ParticipantsService,
              public translate_service: Translate_Service,
              private _CurrentdataService: CurrentdataService) { }

  ngOnInit() {
    if (this._auth.isAdministrator()) {
      this.activeRoute.params.subscribe((params: Params) => {
          if (params['idperson'] !== null && params['idperson'] !== undefined) {
            this._ParticipantsService.getPerson(params['idperson']).subscribe(item => {
                this.currentperson = item as person;
              }
            )
          }
        }
      )
    } else {
      this.currentperson = this._FactoryService.getnewPerson();
      this._auth.getCurrentUser().subscribe(
        person => {
          this.currentperson = person
        }
      );
    }
  }

  editMode() {
    return this.edit;
  }

  haveInsta(): boolean {
    return this.currentperson.insta !== "";
  }

  savePerson() {
    this._ParticipantsService.setPerson(this.currentperson)
  }

  enableEdit() {
    this.edit = true
  }


}
