import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ParticipantsService} from '../../../services/participants.service';
import {Translate_Service} from '../../../services/translate.service';
import {Observable} from 'rxjs/Rx';
import {car, competition, competitionclass, participant, person, team} from '../../../interfaces/app.interface';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {EventsService} from '../../../services/events.service';
import {CurrentdataService} from '../../../services/currentdata.service';
import {FactoryService} from '../../../services/factory.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  public currentParticipant: participant;
  private idevent: string;
  private newperson: boolean = false;
  private newcar: boolean = false;

  private persons: person[] = [];
  public FilteredPersons: Observable<person[]>;
  public personsControl = new FormControl();

  private FilteredCars: Observable<car[]>;
  private carsControl = new FormControl();
  private cars: car[] = [];

  public edit: boolean = false;

  private arrayclassDecibelLeague: competitionclass[];
  private arrayclassDecibelBattle: competitionclass[];
  private arrayclassDecibelShow: competitionclass[];
  private arrayclassDecibelVolume: competitionclass[];

  public teams: team[];

  constructor(public _auth: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private translate_service: Translate_Service,
              private _CurrentdataService: CurrentdataService,
              private _FactoryService: FactoryService,
              private _EventsService: EventsService)
  {}

  ngOnInit() {

    this._EventsService.getCompetitionClassesObs().subscribe(items => {
      this.arrayclassDecibelBattle = this._EventsService.getCompetitionClasses(items, competition.DecibelBattleQualy);
      this.arrayclassDecibelLeague = this._EventsService.getCompetitionClasses(items, competition.DecibelLeague);
      this.arrayclassDecibelShow = this._EventsService.getCompetitionClasses(items, competition.DecibelShow);
      this.arrayclassDecibelVolume = this._EventsService.getCompetitionClasses(items, competition.DecibelVolume);
    });

    this._ParticipantsService.getPersons().subscribe(items =>
      this.persons = items);

    this._ParticipantsService.getCars().subscribe(items =>
      this.cars = items);

    this.FilteredPersons = this.personsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => {return typeof value === 'string' ? this._filterperson(value) : this._setPersonToParticipant(value)
        }
        )
      );

    this.FilteredCars = this.carsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? this._filtercar(value) : this._setCarToParticipant(value)
        )
      );

    this.currentParticipant = this._FactoryService.getnewParticipantclass(this.idevent);
    this.activeRoute.params.subscribe((params: Params) =>
    {
      this.idevent = params["idevent"];
      this._ParticipantsService.setidcurrenevent(this.idevent);
      if (params["idParticipant"] !== null && params["idParticipant"] !== undefined)
        {
          this._ParticipantsService.getParticipant(params["idParticipant"]).subscribe(item =>
            {this.currentParticipant = item;
            this.newperson = this.currentParticipant.person.id == "";
            /*this.newcar = this.currentParticipant.car.id == ""*/})
        }
    }
    );
    if (this._CurrentdataService.getseason().id =="") {
      this._CurrentdataService.getseasonOnce().then( item => {
        this._EventsService.getTeams(item.val().id).subscribe( items => this.teams = items);
        }
      )
    }
    else {
      this._EventsService.getTeams(this._CurrentdataService.getseason().id).subscribe( items => this.teams = items);
    }

  }

    setParticipant() {
      this.currentParticipant.idevent = this.idevent;
      this._ParticipantsService.setParticipant(this.currentParticipant);
      this.router.navigate(['/event/' + this.idevent]);

  }

  private _filterperson(name: string): person[] {
    const filterValue = name.toLowerCase();
    return this.persons.filter(option =>
      option.name.toLowerCase().indexOf(filterValue) === 0 || option.familyName.toLowerCase().indexOf(filterValue) === 0
      || option.telephone.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _setPersonToParticipant(value: person): undefined {

    this.currentParticipant.person = value;
    return null
  }

  private _filtercar(name:string): car[] {
    const filterValue = name.toLowerCase();

    return this.cars.filter(option =>
      option.model.toLowerCase().indexOf(filterValue) === 0 || option.alternateName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _setCarToParticipant(value: car): undefined {

    if (value.id !== "") {
      this.currentParticipant.car = value;
      this._ParticipantsService.getDataCarOnce(value.id).then(items => {

        items.forEach(_datacar =>
          this.currentParticipant.datacar =_datacar.val()
        );
        this.currentParticipant.datacar.id = "";
        this.currentParticipant.datacar.idevent = this.idevent;
      }
      )
    }
    return null
  }

  displayPerson(person: person): string | undefined {
    return person ? person.familyName + " - " + person.name + " - " + person.telephone : undefined;
  }

  displayCar(car: car): string | undefined {
    return car ? car.model + " - " + car.alternateName : undefined;
  }

  selected(classel: any, currentclassel: any) {
    return classel == currentclassel;
  }

  selectedid(classel: any, currentclassel: any) {
    if (classel == undefined || currentclassel == undefined) {
      return false;
    }
    return classel.id == currentclassel.id;
  }

  AllowSearchPerson() {
    return !this.currentParticipant.registered && !this.newperson && this._auth.isAdministrator();
  }

  DisablePerson() {
    return !((this.newperson || this.isNew() || this.edit) && this._auth.isAdministrator());
  }

  AllowSearchCar() {
    return !this.currentParticipant.registered && !this.newcar && this._auth.isAdministrator();
  }

  DisableCar() {
    return !(!this.currentParticipant.registered && this.newcar && this._auth.isAdministrator());
  }

  DisableFields() {
    return !((this.isNew() || this.edit) && this._auth.isAdministrator());
  }

  changeNewPerson() {
    if (this.newperson) {
      this.currentParticipant.person.id = "";
    }
  }

  enableEdit() {
    this.edit = !this.edit;
  }

  isNew(): boolean {
    return this.currentParticipant.id == "";
  }

  changeNewCar() {
    if (this.newcar) {
      this.currentParticipant.car.id = "";
    }
  }

}
