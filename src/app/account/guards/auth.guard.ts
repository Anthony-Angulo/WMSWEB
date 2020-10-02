import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {

    if (localStorage.getItem('token') != null) {
      const roles = next.data.permittedRoles as Array<string>;
      if (roles) {
        if (this.userService.roleMatch(roles)) {
          return true;
        } else {
          this.router.navigate(['/forbidden']);
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }

    // this.router.navigate(['/login']);
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    // return false;
  }

}
