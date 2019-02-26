import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../../services/participants.service';
import {Translate_Service} from '../../../services/translate.service';
import {Observable} from 'rxjs/Rx';
import {participant, person} from '../../../interfaces/app.interface';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  private currentParticipant: participant;
  private ParticipantObs: Observable<participant>;
  private idevent: string;
  private searchperson: string;
  private persons: person[] = [];
  private FilteredPersons: Observable<person[]>;
  private personsControl = new FormControl();

  constructor(private _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private translate_service: Translate_Service)
  {}

  ngOnInit() {

    this._ParticipantsService.getPersons().subscribe(items =>
      this.persons = items);

    this.FilteredPersons = this.personsControl.valueChanges
      .pipe(
        startWith<string | person>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => this._filterperson(name))
      );

    this.currentParticipant = this._ParticipantsService.getnewParticipantclass();
    this.activeRoute.queryParams.subscribe((params: Params) =>
    {
      this.idevent = params["idevent"];
      this._ParticipantsService.setidcurrenevent(this.idevent);
      if (params["idParticipant"] !== null && params["idParticipant"] !== undefined)
        {
          this.ParticipantObs = this._ParticipantsService.getParticipant(params["idParticipant"]);
          this.ParticipantObs.subscribe(item => {this.currentParticipant = item; console.log(this.currentParticipant)})
        };
    }
    )
  }

    setParticipant() {
    this._ParticipantsService.setParticipant(this.currentParticipant)
  }

  private _filterperson(name: string): person[] {
    const filterValue = name.toLowerCase();

    return this.persons.filter(option =>
      option.name.toLowerCase().indexOf(filterValue) === 0


    );
  }

  displayPerson(person: person): string | undefined {
    return person ? person.familyName + " - " + person.name + " - " + person.telephone : undefined;
  }

}
