import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ParticipantsService} from '../../services/participants.service';
import {person} from '../../interfaces/app.interface';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {

  persons: person[];

  constructor(private authService: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService) { }

  ngOnInit() {
    this._ParticipantsService.getPersons().subscribe(items =>
    this.persons = items)
  }

}
