import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireDatabase, AngularFireList , AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface participant {
  id: string,
  name: string,
  familyName: string,
  email: string,
  telephone: string,
  city: string
}

@Injectable()
export class ParticipantsService {

  private currentParticipant: Observable<participant>;
  private participants: Observable<participant[]>;

  constructor(private _db: AngularFireDatabase,
              private router: Router,
              private _auth: AuthService) {
    this.participants = this._db.list<participant>('/participants/').valueChanges();
    this.currentParticipant = this._db.object<participant>('/participants/').valueChanges();
  }

  getParticipants() {
    return this.participants
  }

  setParticipant(participant: participant) {
    if (participant.id == "") {
      this._db.list('/participants/').push(participant).then((snapshot) => {
        //console.log(snapshot.key);
        this._db.object('/participants/' + snapshot.key).update({"id": snapshot.key})
      });
    }
    else {
        this._db.object('/participants/' + participant.id).update(participant)
      }
  }

  getParticipant(keyparticipant) {
    console.log(keyparticipant);
    this.currentParticipant = this._db.object<participant>('/participants/' + keyparticipant).valueChanges();
    return this.currentParticipant;
  }

  getnewParticipantclass() {
    return new class implements participant {
      city: string = "";
      email: string = "";
      familyName: string = "";
      id: string = "";
      name: string = "";
      telephone: string = "";
    }
    }

}
