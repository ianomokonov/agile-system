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

@NgModule({
  declarations: [
    AppComponent,
    SingUpComponent,
    SignInComponent,
    ResetPasswordComponent,
    ProjectsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule, ReactiveFormsModule],
  providers: [FormBuilder],
  bootstrap: [AppComponent],
})
export class AppModule {}
