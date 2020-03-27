import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const currentUser = this.userService.currentUserValue;
      if (currentUser) {
        if (next.data.roles && !currentUser.roles.some(e => next.data.roles.includes(e))) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }
      this.router.navigate(['/404']);
      return false;
  }

}
