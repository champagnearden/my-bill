import { Component, OnInit } from '@angular/core';
import { UserModel, MeDialogInject, RoleModel, DefaultUser } from '../../../../assets/models/user.model';
import { AdminService } from '../../../services/admin/admin.service';
import { UserService } from '../../../services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MeComponent } from '../../me/me.component';
import { SUBJECT, generateBody } from '../../../../assets/models/email.model';
import { BUBBLE_TIME_MS, CHART_THEME } from '../../../../environments/environment'

const FAKE_TIMEOUT = 2000;
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
  standalone: false
})
export class AdminHomeComponent implements OnInit {
  users: UserModel[] = [];
  roles: RoleModel[] = [];
  copied: { [key: string]: boolean } = {};
  lastUpdated: number = new Date().getTime();
  usersLoading: boolean = true;
  statsLoading= {
    countries: true,
    roles: true,
    genders: true,
    usersCRUD: true
  };
  countriesOptions = {
	  animationEnabled: true,
	  theme: CHART_THEME,
	  exportEnabled: true,
	  title: {
		  text: "Countries distribution"
	  },
	  subtitles: [{
		  text: "Chart of all countries based on phone number"
	  }],
	  data: [{
		  type: "pie", //change type to column, line, area, doughnut, etc
		  indexLabel: "{name}: {prop}%",
		  dataPoints: [{}]
	  }]
	}
  genderOptions = {
	  animationEnabled: true,
	  theme: CHART_THEME,
	  exportEnabled: true,
	  title: {
		  text: "Gender distribution"
	  },
	  data: [{
		  type: "pie", //change type to column, line, area, doughnut, etc
		  indexLabel: "{name}: {prop}%",
		  dataPoints: [{}]
	  }]
	}
  rolesOptions = {
	  animationEnabled: true,
	  theme: CHART_THEME,
	  exportEnabled: true,
	  title: {
		  text: "Roles distribution"
	  },
	  data: [{
		  type: "pie", //change type to column, line, area, doughnut, etc
		  indexLabel: "{name}: {prop}%",
		  dataPoints: [{}]
	  }]
	}
  usersCRUDOptions = {
		animationEnabled: true,
		theme: CHART_THEME,
	  exportEnabled: true,
		title:{
			text: "Users CRUD"
		},
		axisX:{
			valueFormatString: "DD MMM",
			crosshair: {
				enabled: true,
				snapToDataPoint: true
			}
		},
		axisY: {
			title: "Number of Visits",
			crosshair: {
				enabled: true
			}
		},
		toolTip:{
			shared:true
		},  
		legend:{
			cursor: "pointer",
			verticalAlign: "bottom",
			horizontalAlign: "right",
			dockInsidePlotArea: true,
			itemclick: function(e: any) {
				if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				} else{
					e.dataSeries.visible = true;
				}
				e.chart.render();
			}
		},
		data: [{
			type: "line",
			showInLegend: true,
			name: "Total Creation",
			lineDashType: "dash",
			markerType: "square",
			xValueFormatString: "DD MMM YYYY",
			dataPoints: [{}]
		},
		{
			type: "line",
			showInLegend: true,
			name: "Total Updates",
			lineDashType: "dot",
      xValueFormatString: "DD MMM YYYY",
			dataPoints: [{}]
		}]
	}

  constructor(
    private readonly adminService: AdminService, 
    private readonly userService: UserService, 
    private readonly dialog: MatDialog
  ) {}
  
  ngOnInit() {
    this.usersLoading = true;
    this.adminService.getRoles().subscribe({
      next: (data: RoleModel[]) => this.roles = data,
      error: (error: any) => console.log(error),
      complete: () => this.usersLoading = false
    });
    this.getUsers();
  }

  openDialog(userInfo?: UserModel) {
    const title = userInfo ? "Edit "+userInfo.username+"'s information" : "Create user";
    userInfo = userInfo ?? DefaultUser;
    const dialogRef = this.dialog.open(MeComponent, {
      maxWidth: '100%',
      height: '75%',
      panelClass: 'dialog-responsive',
      data: {
        userInfo,
        title,
        from: AdminHomeComponent.name,
      } as MeDialogInject,
    });

    dialogRef.afterClosed().subscribe((result: UserModel) => {
      if (result) {
        if (userInfo) {
          this.adminService.updateUser(result).subscribe({
            next: () => {
              this.getUsers();
            },
            error: (error: any) => console.log(error),
          });
        } else {
          this.adminService.createUser(result).subscribe({
            next: () => {
              this.getUsers();
            },
            error: (error: any) => console.log(error),
          });
        }
      }
    });
  }

  getUsers() {
    this.usersLoading = true;
    Object.keys(this.statsLoading).forEach((key: string) => {
      (this.statsLoading as any)[key] = true;
    });
    setTimeout(() => {
      this.adminService.getUsers().subscribe({
        next: (data: UserModel[]) => this.users = data,
        error: (error: any) => console.log(error),
      });
      this.usersLoading = false;
      this.getStats();
    }, FAKE_TIMEOUT);
  }

  getStats() {
    setTimeout(() => {
      this.getGenders();
      this.getRoles();
      this.getCountries();
      this.getCRUD();
      this.lastUpdated = new Date().getTime();
    }, FAKE_TIMEOUT);
  }

  private getDate(date: Date): string {
    const YYYY = date.getFullYear();
    const MM = date.getMonth()+1;
    const DD = date.getDate();
    return `${MM}/${DD}/${YYYY}`;
  }

  private getCRUD() {
    const usersCrations = this.users.map((user) => this.getDate(new Date(user.createdAt)));
    const uniqueCreationDays = [...new Set(usersCrations)];
    const createCount = uniqueCreationDays.map((day) => {
      const y = usersCrations.filter((d) => d === day).length;
      return {
        x: new Date(day),
        y,
      };
    });

    const usersUpdates = this.users.map((user) => this.getDate(new Date(user.updatedAt)));
    const uniqueUpdateDays = [...new Set(usersUpdates)];
    const updateCount = uniqueUpdateDays.map((day) => {
      const y = usersUpdates.filter((d) => d === day).length;
      return {
        x: new Date(day),
        y,
      };
    });

    this.usersCRUDOptions.data[0].dataPoints = createCount;
    this.usersCRUDOptions.data[1].dataPoints = updateCount;
    this.statsLoading.usersCRUD = false;

  }
  
  private getGenders() {
    const genders = this.users.map((user) => user.gender);
    const uniqueGenders = [...new Set(genders)];
    const gendersCount = uniqueGenders.map((gender) => {
      const y = genders.filter((g) => g === gender).length;
      return {
        name: gender,
        y,
        prop: Math.round((y / this.users.length) * 100),
      };
    });
    this.genderOptions.data[0].dataPoints = gendersCount;
    this.statsLoading.genders = false;
  }

  private getRoles() {
    this.users.forEach((user) => {
      this.roles[this.roles.findIndex((r) => r.name == user.role)].y++;
    });
    this.roles = this.roles.filter((r) => r.y > 0);
    this.roles.forEach((r) => {
      r.prop = Math.round((r.y / this.users.length) * 100);
    });
    this.rolesOptions.data[0].dataPoints = this.roles;
    this.statsLoading.roles = false;
  }

  private getCountries() {
    const countries = this.users.map((user) => user.phone.iso2);
    const uniqueCountries = [...new Set(countries)];
    const countriesCount = uniqueCountries.map((country) => {
      const y = countries.filter((c) => c === country).length;
      return {
        name: country,
        y,
        prop: Math.round((y / this.users.length) * 100),
      };
    });
    this.countriesOptions.data[0].dataPoints = countriesCount;
    this.statsLoading.countries = false;
  }

  copy(key: string, ...text: string[]) {
    navigator.clipboard.writeText(text.join(" ")).then(() => {
      this.copied[key] = true;
      setTimeout(() => {
        this.copied[key] = false;
      }, BUBBLE_TIME_MS);
    });
  }

  getBody(id: number){
    const user = this.users.filter((u) => u.id===id)[0];
    const userName = `${user.firstName} ${user.middleName ? user.middleName.charAt(0).toUpperCase()+'. ': ''}${user.lastName.toUpperCase()}`
    return `subject=${SUBJECT}&body=${generateBody(userName, this.userService.userData())}`;
  }

}
