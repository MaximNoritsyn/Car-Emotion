import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {participant, ParticipantsService} from '../../services/participants.service';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import {forEach} from '@angular/router/src/utils/collection';
import {promise} from 'selenium-webdriver';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  participants: Observable<participant[]>;

  constructor(private authService: AuthService,
              private router: Router,
              private _ParticipantsService: ParticipantsService) { }

  ngOnInit() {
    this.participants = this._ParticipantsService.getParticipants();
    //console.log(this.participants)
  }

  addNewParticipant() {
    this.router.navigate(['/newparticipant']);
  }


}
