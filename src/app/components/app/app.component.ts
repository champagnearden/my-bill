import { Component, OnInit, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../../assets/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})

export class AppComponent implements OnInit {
  title = 'Billing Website';
  user: WritableSignal<UserModel>;
  isLoggedIn: boolean = true;
  loading: boolean = false;

  constructor(private readonly userService: UserService, private readonly router: Router) {
    this.user = this.userService.userData
    this.isLoggedIn = this.userService.isLoggedIn;
  }
  
  ngOnInit(): void {
    this.loading = true;
    this.user = this.userService.userData;
    this.isLoggedIn = this.userService.isLoggedIn;
    this.loading = false;
  }

  logout(): void {
    this.loading = true;
    this.userService.logout();
    this.isLoggedIn = this.userService.isLoggedIn;
    this.router.navigate(['/']);
    this.loading = false;
  }
}
