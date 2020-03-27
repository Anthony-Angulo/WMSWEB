import { Component } from '@angular/core';
import { UserService } from './account/services/user.service';
import { User } from './account/interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WMS';
  currentUser: User;

  constructor(private userService: UserService) {
    this.userService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }
}
