import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ParticipantsService} from '../../../services/participants.service';
import {FactoryService} from '../../../services/factory.service';
import {participant, person, result} from '../../../interfaces/app.interface';
import {EventsService} from '../../../services/events.service';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-mergepersons',
  templateUrl: './mergepersons.component.html',
  styleUrls: ['./mergepersons.component.css']
})
export class MergepersonsComponent implements OnInit {

  public person1: person;
  public person2: person;

  public id1: string;
  public id2: string;

  public participants1: participant[];
  public participants2: participant[];

  public results1: result[];
  public results2: result[];

  private deleted: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              private _EventService: EventsService,
              private activeRoute: ActivatedRoute,
              private _ParticipantsService: ParticipantsService,
              private _db: AngularFireDatabase,
              private _FactoryService: FactoryService) {
  }

  ngOnInit() {
    this.person1 = this._FactoryService.getnewPerson();
    this.person2 = this._FactoryService.getnewPerson();
    this.deleted = false;
  }

  changeIdPrimary() {
    this._ParticipantsService.getPersonOnce(this.id1).query.once('value').then(_data => {
       if (_data.val() !== null) {
        this.person1 = _data.val();
      }
        let localparticipants: participant[] = [];
        this._ParticipantsService.duty_getParticipants().then(events => {
            events.forEach(event => {
              event.forEach(_participants => {
                _participants.forEach(_value => {
                  let _participant: participant = _value.val();
                  if (_participant.idperson == this.id1)
                    localparticipants.push(_participant);
                })
              })
            });
            this.participants1 = localparticipants;
          }
        );
        this._ParticipantsService.getResultssOfPerson(this.id1).subscribe(items => this.results1 = items
        )
      }
    )
  }

  changeIdDelete() {
    this._ParticipantsService.getPersonOnce(this.id2).query.once('value').then(_data => {

      if (_data.val() !== null) {
        this.person2 = _data.val();
      }
        let localparticipants: participant[] = [];
        this._ParticipantsService.duty_getParticipants().then(events => {
            events.forEach(event => {
              event.forEach(_participants => {
                _participants.forEach(_value => {
                  let _participant: participant = _value.val();
                  if (_participant.idperson == this.id2)
                    localparticipants.push(_participant);
                })
              })
            });
            this.participants2 = localparticipants;
          }
        );
        this._ParticipantsService.getResultssOfPerson(this.id2).subscribe(items => this.results2 = items
        )
      }
    )
  }

  VisibleButtonDelete() {
    return this.deleted || this.id1 == '' || this.id2 =='';
  }

  delete1() {
    this.deleted = true;
    this.participants1.forEach(part =>
    {
      part.person = this.person2;
      part.idperson = this.id2;
      this._db.object('/participants/' + part.idevent + '/all/' + part.id).update(part);
    });
    this.results1.forEach(res1 =>
    {
      res1.idperson = this.id2;
      this._db.object<result>('/results/' + res1.id).update(res1);
    });
    this._db.object('/persons/' + this.id1).remove();
    this.changeIdDelete();
  }

  delete2() {
    this.deleted = true;
    this.participants2.forEach(part =>
    {
      part.person = this.person1;
      part.idperson = this.id1;
      this._db.object('/participants/' + part.idevent + '/all/' + part.id).update(part);
    });
    this.results2.forEach(res1 =>
    {
      res1.idperson = this.id1;
      this._db.object<result>('/results/' + res1.id).update(res1);
    });
    this._db.object('/persons/' + this.id2).remove();
    this.changeIdPrimary();
  }

}
