import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/model/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  public isLoggedOut: boolean = false;
  public user: UserModel;

  constructor(private router: Router, private userService: UserService) {
    this.userService.user.subscribe((userModel) => {
      this.user = userModel;
      this.isLoggedOut = userModel == null || userModel === undefined;
    });
  }

  ngOnInit(): void {}

  loginClicked() {
    this.router.navigate(['/login']);
  }

  aboutClicked() {
    this.router.navigate(['/about']);
  }

  onLogoClick() {
    this.router.navigate(['/dashboard']);
  }

  logoutClicked() {
    var user = localStorage.getItem('user_detail');
    var userEmail = JSON.parse(user).email;
    (<any>window).api.send('deletePassword', {
      service: 'authService',
      userEmail: userEmail,
    });
    this.router.navigate(['/login']);
    // this.userService.setUser(null);
    // localStorage.clear();
    // this.router.navigate(["/login"]);
  }
}
