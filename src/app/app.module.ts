import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ApiService } from './api/api.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgIndicatorComponent } from './prog-indicator/prog-indicator.component';
import { AuthGuard } from './shared/auth.guard.service';
import { UserService } from './shared/user.service';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], },
  { path: 'contract-detail', component: ContractDetailComponent, canActivate: [AuthGuard], },
  { path: '', component: LoginComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent,
    ToolbarComponent,
    DashboardComponent,
    ProgIndicatorComponent,
    ContractDetailComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    RouterModule.forRoot(routes),
    FlexLayoutModule
  ],
  providers: [
    UserService,
    AuthGuard,    
    ApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
