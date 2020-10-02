import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('token'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post(environment.apiCRM + '/Account/Login', { email, password })
      .toPromise()
      .then((user: any) => {
        localStorage.setItem('token', user.token);
        return user;
      }).catch(error => console.error(error));
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    const userRole = payLoad.role;
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }

}
