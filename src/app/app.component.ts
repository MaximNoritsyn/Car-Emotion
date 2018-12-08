import { Component } from '@angular/core';
import construct = Reflect.construct;
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(public authService: AuthService, private router: Router) { }

  openPageParticipants() {
    this.router.navigate(['/participants'])
  }
  openPageDashboard() {
    this.router.navigate([''])
  }
  openPageLogin() {
    this.router.navigate(['login'])
  }
}


