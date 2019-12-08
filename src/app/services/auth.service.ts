import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';
import {person, result} from '../interfaces/app.interface';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private person: person = null;

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
              private router: Router) {
    this.user = _firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          this._db.list<person>('/persons/',
            ref => (ref.orderByChild('userUid').equalTo(this.userDetails.uid)
            )).valueChanges().subscribe(person => this.person = person.length > 0 ? person[0] : null);
          console.log(user);
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

  createUserAutomatic(email: string, pass: string) {
    //var pass = getASecureRandomPassword()
    return firebase.auth().createUserWithEmailAndPassword(email, pass);
  }

  changePass(pass: string) {
    if (!this.isAdministrator()) {
      return this.userDetails.updatePassword(pass);
    }

  }

  isLoggedIn() {
    return !(this.userDetails == null)
  }

  isAdministrator() {
    return !(this.userDetails == null) && (this.person == null)
  }

  logout() {
    this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }
}
