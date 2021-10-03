import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,): Observable<boolean> | Promise<boolean> | boolean {

    var token = localStorage.getItem('exp_token');

    if (token == null || token === undefined) {
      this.router.navigate(['/login']);
      this.userService.sendMessage('Access Denied', true);
      return false;
    }
    return true;
  }
}