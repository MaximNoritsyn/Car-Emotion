import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList , AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import {promise} from 'selenium-webdriver';

export interface participant {
  $key: string,
  name: string,
  familyName: string,
  email: string,
  telephone: string,
  city: string
}

@Injectable()
export class ParticipantsService {

  private currentParticipant: AngularFireObject<participant>;
  private createnew: boolean;
  private participants: AngularFireList<participant>;

  constructor(private _db: AngularFireDatabase,
              private router: Router,
              private _auth: AuthService) {
    this.participants = this._db.list('/participants/')
  }

  getParticipants() {
    return this.participants
  }

  isNew() {
    this.createnew = true;
  }

  inNotNew() {
    this.createnew = false;
  }

  setParticipant(participant: participant) {
    if (this.createnew) {
      this._db.list('/participants/').push(participant)
    }
    else {
      this.currentParticipant.update(participant)
    }
  }

  getParticipant(keyparticipant) {
    this.currentParticipant = this._db.object('/participants/' + keyparticipant)
    console.log(keyparticipant)
    return this.currentParticipant;
  }
}
