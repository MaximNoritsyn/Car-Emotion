import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../services/participants.service';
import {CurrentdataService} from '../../services/currentdata.service';
import {FactoryService} from '../../services/factory.service';
import {EventsService} from '../../services/events.service';
import {event} from '../../interfaces/app.interface';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  currentevent: event;
  private eventObs: Observable<event>;

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private _CurrentdataService: CurrentdataService,
              private _FactoryService: FactoryService,
              private _EventsService: EventsService) { }

  ngOnInit() {


  }

}
