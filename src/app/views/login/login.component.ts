import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {Translate_Service} from '../../services/translate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService,
              private router: Router,
              private translate_service: Translate_Service) {
  }


   signInWithTwitter() {
      this.authService.signInWithTwitter()
      .then((res) => {
          this.router.navigate([''])
        })
      .catch((err) => console.log(err));
    }


    signInWithFacebook() {
      this.authService.signInWithFacebook()
      .then((res) => {
          this.router.navigate([''])
        })
      .catch((err) => console.log(err));
    }


    signInWithGoogle() {
      this.authService.signInWithGoogle()
      .then((res) => {
          this.router.navigate([''])
        })
      .catch((err) => console.log(err));
    }

    signInWithGithub() {
      this.authService.signInWithGithub()
      .then((res) => {
          this.router.navigate([''])
        })
      .catch((err) => console.log(err));
    }

    signInWithEmail() {

      this.authService.signInRegular(this.user.email, this.user.password)
        .then((res) => {
          console.log(res);
          this.router.navigate(['']);
        })
        .catch((err) => console.log('error: ' + err));
    }




  ngOnInit() {
  }

}
