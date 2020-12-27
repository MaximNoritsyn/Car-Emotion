import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class IsAdminGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate() {
    if (this.authService.isAdministrator()) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

}

@Injectable()
export class IsLoggedGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

}
