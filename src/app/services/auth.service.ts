import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';
import {person, result} from '../interfaces/app.interface';
import * as admin from 'firebase-admin';
import {FactoryService} from './factory.service';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private person: person = null;
  private isAdmin: boolean = false;

  getIdToken = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          user.getIdToken().then((idToken) => {
            resolve(idToken);
          }, (error) => {
            resolve(null);
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  constructor(private _firebaseAuth: AngularFireAuth,
              private _db: AngularFireDatabase,
              private router: Router,
              private _FactoryService: FactoryService) {
    this.user = _firebaseAuth.authState;

    this.person = _FactoryService.getnewPerson();
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          this._db.list<person>('/persons/',
            ref => (ref.orderByChild('userUid').equalTo(this.userDetails.uid)
            )).valueChanges().subscribe(person => this.person = person.length > 0 ? person[0] : null);
        } else {
          this.userDetails = null;
        }
      }
    );
  }

  signInRegular(email: string, password: string) {
    //const credential = firebase.auth.EmailAuthProvider.credential( email, password );

    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }

  isLoggedIn() {
    return !(this.userDetails == null)
  }

  isAdministrator() {
    return !(this.userDetails == null) && (this.person == null) && (this.isAdmin)
  }

  logout() {
    this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }

  idPersonCurrentUser() : string {
    return this.person == null ? '' : this.person.id;
  }

  recaptcha() {
    return new firebase.auth.RecaptchaVerifier('recaptcha-container')
  }

  get windowRef() {
    return window
  }

  setAdminStatus(result: boolean): void {
    this.isAdmin = result;
  }

}
