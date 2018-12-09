import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {participant, ParticipantsService} from '../../services/participants.service';
import { FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {forEach} from '@angular/router/src/utils/collection';
import {promise} from 'selenium-webdriver';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  participants: participant[];

  constructor(public authService: AuthService, private router: Router, private _ParticipantsService: ParticipantsService) { }

  ngOnInit() {
    this._ParticipantsService.getParticipants().subscribe(snapshot => {
      this.participants = snapshot
    }
       )
  }

  addNewParticipant() {
    this.router.navigate(['/newparticipant']);
  }

  openChildParticipant(id: string) {
    this.router.navigate(['/participant/:'+id]);
  }

}
