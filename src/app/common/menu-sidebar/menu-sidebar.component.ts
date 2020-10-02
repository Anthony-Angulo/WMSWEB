import { Component, OnInit } from '@angular/core';
import { User } from '../../account/interfaces/user';
import { UserService } from '../../account/services/user.service';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {

  currentUser: User;

  constructor(private userService: UserService) {
    // this.userService.currentUser.subscribe(x => {
    //   this.currentUser = x;
    // });
  }

  ngOnInit(): void {
    // console.log('MenuSideBarComponent');
  }

}
