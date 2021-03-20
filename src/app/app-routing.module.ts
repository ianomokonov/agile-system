import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { CreateComponent } from './profile/projects/create/create.component';
import { EditProjectFormComponent } from './project/edit-project-form/edit-project-form.component';
import { EditRolesComponent } from './project/edit/edit-roles/edit-roles.component';
import { EditUsersComponent } from './project/edit/edit-users/edit-users.component';
import { TaskComponent } from './project/project-board/task/task.component';
import { ProjectComponent } from './project/project.component';
import { ResetPasswordComponent } from './security/reset-password/reset-password.component';
import { SignInComponent } from './security/sign-in/sign-in.component';
import { SingUpComponent } from './security/sing-up/sing-up.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SingUpComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'create-project',
    component: CreateComponent,
  },
  {
    path: 'project/:id',
    component: ProjectComponent,
  },
  {
    path: 'project/:id/edit',
    component: CreateComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'info',
      },
      {
        path: 'info',
        pathMatch: 'full',
        component: EditProjectFormComponent,
      },
      {
        path: 'roles',
        component: EditRolesComponent,
      },
      {
        path: 'users',
        component: EditUsersComponent,
      },
    ],
  },
  {
    path: 'task/:id',
    component: TaskComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
