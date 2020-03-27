import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService) {
    if (this.userService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService.login(this.f.email.value, this.f.password.value)
      .then(data => {
        console.log(data);
        if (data.status) {
          window.location.reload();
        } else {
          this.f.password.reset();
        }
      })
      .catch(error => console.error(error))
      .finally(() => this.loading = false);
  }

}
