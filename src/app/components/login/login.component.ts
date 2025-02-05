import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { LoginError } from  '../../../assets/models/errors.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userService: UserService;
  router: Router;
  loginErrors: LoginError[] = [];
  constructor(private readonly fb: FormBuilder, userService: UserService, router: Router) {
    this.userService = userService;
    this.router = router;
    this.loginForm = this.fb.group({
      username: ['admin', Validators.required],
      password: ['admin', Validators.required]
    });
  }

  ngOnInit() {
    this.loginErrors = [];
  }

  closeAlert(index: number):void {
    this.loginErrors.splice(index, 1);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      try {
        const user = this.userService.login(username, password);
        this.userService.setUserData(user);
        this.router.navigate(['/']);
      } catch (err:any) {
        this.loginErrors.push(err);
        console.error('Login Error:', err.message);
      };
      // Further processing, e.g., authentication logic
    }
  }
}
