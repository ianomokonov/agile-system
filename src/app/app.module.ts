import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SingUpComponent } from './security/sing-up/sing-up.component';
import { SignInComponent } from './security/sign-in/sign-in.component';
import { ResetPasswordComponent } from './security/reset-password/reset-password.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './projects/project/project.component';
import { HeaderComponent } from './projects/header/header.component';
import { TasksComponent } from './projects/project/tasks/tasks.component';
import { TeamComponent } from './projects/project/team/team.component';
import { StatisticsComponent } from './projects/project/statistics/statistics.component';
import { DashboardsComponent } from './projects/project/dashboards/dashboards.component';

@NgModule({
  declarations: [
    AppComponent,
    SingUpComponent,
    SignInComponent,
    ResetPasswordComponent,
    ProjectsComponent,
    ProjectComponent,
    HeaderComponent,
    TasksComponent,
    TeamComponent,
    StatisticsComponent,
    DashboardsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule, ReactiveFormsModule],
  providers: [FormBuilder],
  bootstrap: [AppComponent],
})
export class AppModule {}
