import { Component, OnInit, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserModel, MeDialogInject } from '../../../assets/models/user.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MeComponent } from '../me/me.component'

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

  constructor(
    private readonly userService: UserService, 
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {
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

  openMeDialog() {
    const dialogRef = this.dialog.open(MeComponent, {
      maxWidth: '100%',
      height: '75%',
      panelClass: 'dialog-responsive',
      data: {
        userInfo: this.user(),
        title: "Edit my information",
        from: AppComponent.name,
      } as MeDialogInject,
    });

    dialogRef.afterClosed().subscribe((u: UserModel) => {
      if (u) {
        const user = this.userService.userData();
        user.gender = u.gender;
        user.firstName = u.firstName;
        user.middleName = u.middleName;
        user.lastName = u.lastName;
        user.businessName = u.businessName;
        user.billAddress = u.billAddress;
        user.postAddress = u.postAddress;

        this.userService.setUserData(user);
      }
    });
  }
}
