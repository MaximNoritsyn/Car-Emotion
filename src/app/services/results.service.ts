import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase} from 'angularfire2/database';
import { AuthService } from '../services/auth.service';

import {EventsService} from './events.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private _db: AngularFireDatabase,
              private router: Router,
              private _EventsService: EventsService,
              private _auth: AuthService) { }
}
