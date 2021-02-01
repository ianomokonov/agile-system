import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SingUpComponent } from './security/sing-up/sing-up.component';
import { SignInComponent } from './security/sign-in/sign-in.component';
import { ResetPasswordComponent } from './security/reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectsComponent } from './profile/projects/projects.component';
import { CreateComponent } from './profile/projects/create/create.component';
import { EditUserComponent } from './profile/create/edit-user.component';

@NgModule({
  declarations: [
    AppComponent,
    SingUpComponent,
    SignInComponent,
    ResetPasswordComponent,
    ProfileComponent,
    ProjectsComponent,
    CreateComponent,
    EditUserComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule, ReactiveFormsModule],
  providers: [FormBuilder],
  bootstrap: [AppComponent],
})
export class AppModule {}
