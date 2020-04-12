import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
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

  windowRef: any;

  phoneNumber: string;

  verificationCode: string;

  textCoution: string;

  public enterEmail: boolean = false;

  constructor(private authService: AuthService,
              private router: Router,
              private translate_service: Translate_Service) {
  }

  ngOnInit() {
    this.phoneNumber = '';
    //this.enterEmeil = false;
    this.windowRef = this.authService.windowRef;
    this.windowRef.recaptchaVerifier = this.authService.recaptcha();

    // @ts-ignore
    this.windowRef.recaptchaVerifier
      .render()
      .then(widgetId => {

        this.windowRef.recaptchaWidgetId = widgetId
      });
  }

  signInWithEmail() {

    this.authService.signInRegular(this.user.email, this.user.password)
      .then((res) => {
        this.router.navigate(['']);
        this.authService.setAdminStatus(true);
      })
      .catch((err) => {
        this.authService.setAdminStatus(false)
      });
  }

  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    let num = this.phoneNumber.replace(/[^0-9.]/g, '');

    num = '+' + num;
    console.log(num);
    if (num.length !== 13) {
      this.textCoution = 'Довжина номера не корректна';
    } else {
      this.textCoution = '';
      firebase.auth()
        .signInWithPhoneNumber(num, appVerifier)
        .then(result => {

          this.windowRef.confirmationResult = result;

        })
        .catch(error => this.textCoution = error.toString());
    }
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        this.router.navigate(['']);
        this.authService.setAdminStatus(false);

      })
      .catch(error => this.authService.setAdminStatus(false));
  }

  changeEnterMode() {
    this.enterEmail = !this.enterEmail;
  }

}
