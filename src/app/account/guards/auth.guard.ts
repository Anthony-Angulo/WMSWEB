import { JsonpClientBackend } from '@angular/common/http';
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

                var AppInfo=JSON.parse(localStorage.getItem('AppInfo'))
    if (localStorage.getItem('token') != null) {
      const roles = next.data.permittedRoles as Array<string>;
      if (roles) {
        if (this.userService.roleMatch(roles)) {
          return true
        } else {
          this.router.navigate(['/forbidden']);
          return false;
        }
      }
      if(state.url=="/Invoices/burns"){
        if(AppInfo.Active_Burn==0){
          this.router.navigate(['/dashboard']);
          return false;    
        }
      }else{
        return true;
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
