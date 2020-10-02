import { Component } from '@angular/core';
import { UserService } from './account/services/user.service';
import { User } from './account/interfaces/user';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import './common/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WMS';
  currentUser: User;

  constructor(private userService: UserService, private http: HttpClient, public router: Router) {
    // this.userService.currentUser.subscribe(x => {
    //   this.currentUser = x;
    // });
    // const user = JSON.parse(localStorage.getItem('currentUser'));
    // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + user.token);
    // this.http.get(environment.apiCRM + '/Values/5').toPromise().then(t=> console.log(t)).catch(t=> console.error(t))
  }
}
