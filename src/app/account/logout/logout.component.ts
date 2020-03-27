import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

    constructor(private router: Router, private userService: UserService) { }

    logout() {
        this.userService.logout();
        this.router.navigate(['/login']);
    }

}
