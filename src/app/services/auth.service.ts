import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable, of} from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';
import {person, result} from '../interfaces/app.interface';
import * as admin from 'firebase-admin';
import {FactoryService} from './factory.service';
import {map} from 'rxjs/operators';
import {from} from 'rxjs/internal/observable/from';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private person: Observable<person>;
  private isAdmin: boolean = false;
  private readonly emptyPerson: person;

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

    this.emptyPerson = this._FactoryService.getnewPerson();
    this.person = new Observable((observer) => {
      observer.next(this.emptyPerson);
      this.user.subscribe(
        (user) => {
          if (user) {
            this.userDetails = user;
            if (this.userDetails.phoneNumber == null) {
              this.isAdmin = true;
            } else if (this.userDetails.phoneNumber !== '') {
              this.isAdmin = false;
              this._db.list<person>('/persons/',
                ref => (ref.orderByChild('userUid').equalTo(this.userDetails.phoneNumber)
                )).valueChanges().subscribe(person => {
                  if (person.length > 0) {
                    observer.next(person[0]);
                  } else {
                    this.person = of(this.emptyPerson);
                  }
                }
              );
            } else {
              this.isAdmin = false;
              this.person = of(this.emptyPerson);
            }
          } else {
            this.isAdmin = false;
            this.userDetails = null;
            this.person = of(this.emptyPerson);
          }
        }
      );
    });

  }

  signInRegular(email: string, password: string) {
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }

  isLoggedIn() {
    return !(this.userDetails == null)
  }

  isAdministrator() {
    return !(this.userDetails == null) && (this.isAdmin)
  }

  logout() {
    this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
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

  getUidFromTelephone(telephone: string): string {
    let num = telephone.replace(/[^0-9.]/g, '');
    if (num.length == 10) {
      num = '+38' + num;
    }
    else if (num.length == 11) {
      num = '+3' + num;
    }
    else if (num.length == 12) {
      num = '+' + num;
    }
    else {
      num = ''
    }

    return num;
  }

  getCurrentUser() {
    return this.person;
  }

}
