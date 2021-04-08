import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { CreateComponent } from './profile/projects/create/create.component';
import { EditProjectFormComponent } from './project/edit-project-form/edit-project-form.component';
import { EditRolesComponent } from './project/edit/edit-roles/edit-roles.component';
import { EditUsersComponent } from './project/edit/edit-users/edit-users.component';
import { PlanningListComponent } from './project/planning-list/planning-list.component';
import { MarkTasksComponent } from './project/planning-list/planning/mark-tasks/mark-tasks.component';
import { PlanningComponent } from './project/planning-list/planning/planning.component';
import { ScrumPokerComponent } from './project/planning-list/planning/scrum-poker/scrum-poker.component';
import { ProjectBacklogComponent } from './project/project-backlog/project-backlog.component';
import { ProjectBoardComponent } from './project/project-board/project-board.component';
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
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'board',
      },
      {
        path: 'board',
        component: ProjectBoardComponent,
      },
      {
        path: 'backlog',
        component: ProjectBacklogComponent,
      },
      {
        path: 'planning',
        component: PlanningListComponent,
      },
      {
        path: 'planning/:planningId',
        component: PlanningComponent,
        children: [
          {
            path: '',
            component: MarkTasksComponent,
          },
          {
            path: 'task/:taskId',
            component: ScrumPokerComponent,
          },
        ],
      },
    ],
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
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
