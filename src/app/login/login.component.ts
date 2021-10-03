import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from 'src/model/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private usersService: UserService
  ) {}

  public errorMsg: string;
  public loading: boolean = false;

  loginForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    },
    {}
  );

  ngOnInit(): void {
    (<any>window).api.send('findPassword', { service: 'authService' });
    (<any>window).api.receive('findCredentials', (res) => {
      var email = res[1].account;
      var password = res[1].password;
      var fd = {
        email: email,
        password: password,
      };
      var loginUrl = environment.baseUrl + '/api/auth/login/';
      var userEmail = '';
      this.apiService.postRequest(loginUrl, fd).subscribe((res)=>{
        var result = res as any;
        userEmail = result.user.email;
        this.loading = false;
        this.saveUser(result.user, result.token);
        this.usersService.sendMessage('Login successful.', false);
        this.router.navigate(['/dashboard']);
      },(error: HttpErrorResponse) => {
        this.usersService.sendMessage('Login Failure.', true);
        (<any>window).api.send('deletePassword', {
          service: 'authService',
          userEmail: userEmail,
        });
        this.router.navigate(["/login"]);
        this.loading = false;
        if (error.status == 400) {
          this.errorMsg = 'Incorrect username/password';
        } else if (error.status == 0 || error.status == 500) {
          this.errorMsg = 'Server Error. Please try again later.';
        }
        console.log(error);
      })

    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  loginSubmit() {
    this.loading = true;
    var userEmail = '';
    var loginUrl = environment.baseUrl + '/api/auth/login/';
    this.apiService.postRequest(loginUrl, this.loginForm.value).subscribe(
      (data) => {
        var result = data as any;
        userEmail = result.user.email;
        this.loading = false;
        this.saveUser(result.user, result.token);
        this.usersService.sendMessage('Login successful.', false);
        (<any>window).api.send('savePassword', {
          service: 'authService',
          userEmail: result.user.email,
          password: this.loginForm.value.password,
        });
        this.router.navigate(['/dashboard']);
      },
      (error: HttpErrorResponse) => {
        this.usersService.sendMessage('Login Failure.', true);
        this.loading = false;
        if (error.status == 400) {
          this.errorMsg = 'Incorrect username/password';
        } else if (error.status == 0 || error.status == 500) {
          this.errorMsg = 'Server Error. Please try again later.';
        }
        console.log(error);
      }
    );
  }

  saveUser(userDetails: any, api_token: any) {
    var user = new UserModel();
    user.user_id = userDetails.pk;
    user.user_name = userDetails.username;
    user.first_name = userDetails.first_name;
    user.last_name = userDetails.last_name;
    user.email = userDetails.email;
    user.user_type = userDetails.user_type;
    user.access_token = api_token;
    localStorage.setItem('user_detail', JSON.stringify(user));
    localStorage.setItem('exp_token', api_token);
    this.usersService.setUser(user);
  }
}
