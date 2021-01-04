import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { constants } from 'buffer';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private userService: UserService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.router.navigateByUrl('/');
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const output = Object.assign({}, this.loginForm.value);

    this.userService.login(output)
      .then((res: any) => {
        localStorage.setItem('AppInfo',JSON.stringify(res.AppLogin))
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/');
      })
      .catch(err => {
        if (err.status == 400) {
          this.toastr.error('Incorrect username or password.', 'Authentication failed.');
          console.log('Incorrect username or password.', 'Authentication failed.');
        } else {
          console.log(err);
        }
      });
  }

}
