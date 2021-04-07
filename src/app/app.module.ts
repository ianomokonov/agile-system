import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { ProjectService } from './services/project.service';
import { ProjectComponent } from './project/project.component';
import { EditProjectFormComponent } from './project/edit-project-form/edit-project-form.component';
import { EditRolesComponent } from './project/edit/edit-roles/edit-roles.component';
import { EditUsersComponent } from './project/edit/edit-users/edit-users.component';
import { ProfileService } from './services/profile.service';
import { ProjectBoardComponent } from './project/project-board/project-board.component';
import { TaskService } from './services/task.service';
import { CreateTaskComponent } from './project/project-board/create-task/create-task.component';
import { TaskComponent } from './project/project-board/task/task.component';
import { ProjectDataService } from './services/project-data.service';
import { ProjectBacklogComponent } from './project/project-backlog/project-backlog.component';
import { CreateSprintComponent } from './project/create-sprint/create-sprint.component';
import { EditTaskComponent } from './project/project-board/task/edit-task/edit-task.component';
import { PriorityPipe } from './shared/pipes/priority.pipe';
import { TaskTypePipe } from './shared/pipes/task-type.pipe';

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
    ProjectComponent,
    EditProjectFormComponent,
    EditRolesComponent,
    EditUsersComponent,
    ProjectBoardComponent,
    CreateTaskComponent,
    TaskComponent,
    ProjectBacklogComponent,
    CreateSprintComponent,
    EditTaskComponent,
    PriorityPipe,
    TaskTypePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgSelectModule,
    CKEditorModule,
    DragDropModule,
  ],
  providers: [
    FormBuilder,
    UserService,
    TokenService,
    ProjectService,
    ProfileService,
    ProjectDataService,
    TaskService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
