import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
  standalone: false
})
export class LogoutComponent implements OnInit {

  userService: UserService;
  router: Router;
  loading: boolean = false;
  constructor( userService: UserService, router: Router) {
    this.userService = userService;
    this.router = router;
  }

  ngOnInit(): void {
    this.loading = true;
    this.userService.logout();
    this.router.navigate(['/']);
    this.loading = false;
  }
}

