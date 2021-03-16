import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SingUpComponent } from './security/sing-up/sing-up.component';
import { SignInComponent } from './security/sign-in/sign-in.component';
import { ResetPasswordComponent } from './security/reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectsComponent } from './profile/projects/projects.component';
import { CreateComponent } from './profile/projects/create/create.component';
import { EditUserComponent } from './profile/create/edit-user.component';
import { AuthInterceptor } from './utils/auth.interceptor';
import { UserService } from './services/user.service';
import { TokenService } from './services/token.service';
import { ContentTypeInterceptor } from './utils/content-type.interceptor';
import { TagsInputComponent } from './shared/tags-input/tags-input.component';

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
    TagsInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    FormBuilder,
    UserService,
    TokenService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
