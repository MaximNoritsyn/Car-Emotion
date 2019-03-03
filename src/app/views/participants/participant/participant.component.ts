import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../../services/participants.service';
import {Translate_Service} from '../../../services/translate.service';
import {Observable} from 'rxjs/Rx';
import {competition, competitionclass, participant, person} from '../../../interfaces/app.interface';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {EventsService} from '../../../services/events.service';

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
  private arrayclassDecibelLeague: competitionclass[];
  private arrayclassDecibelBattle: competitionclass[];
  private arrayclassDecibelShow: competitionclass[];
  private arrayclassDecibelVolume: competitionclass[];

  constructor(private _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private translate_service: Translate_Service,
              private _EventsService: EventsService)
  {}

  ngOnInit() {

    this._EventsService.getCompetitionClassesObs().subscribe(items => {
      this.arrayclassDecibelBattle = this._EventsService.getCompetitionClasses(items, competition.DecibelBattle);
      this.arrayclassDecibelLeague = this._EventsService.getCompetitionClasses(items, competition.DecibelLeague);
      this.arrayclassDecibelShow = this._EventsService.getCompetitionClasses(items, competition.DecibelShow);
      this.arrayclassDecibelVolume = this._EventsService.getCompetitionClasses(items, competition.DecibelVolume);
    })

    this._ParticipantsService.getPersons().subscribe(items =>
      this.persons = items);

    this.FilteredPersons = this.personsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? this._filterperson(value) : this._setPersonToParticipant(value)
        )
      );

    this.currentParticipant = this._ParticipantsService.getnewParticipantclass();
    this.activeRoute.params.subscribe((params: Params) =>
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
      option.name.toLowerCase().indexOf(filterValue) === 0 //|| option.familyName.toLowerCase().indexOf(filterValue) === 0
      //|| option.telephone.toLowerCase().indexOf(filterValue)
    );
  }

  private _setPersonToParticipant(value: person): undefined {

    this.currentParticipant.person = value
    return null
  }

  displayPerson(person: person): string | undefined {
    return person ? person.familyName + " - " + person.name + " - " + person.telephone : undefined;
  }

  selectedclass(classel, currentclassel) {
    return classel == currentclassel;
  }

}
