import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Permissions } from 'back/src/models/permissions';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateComponent } from './profile/projects/create/create.component';
import { DailyComponent } from './project/daily/daily.component';
import { DemoComponent } from './project/demo/demo.component';
import { EditProjectFormComponent } from './project/edit-project-form/edit-project-form.component';
import { EditEpicsComponent } from './project/edit/edit-epics/edit-epics.component';
import { EditRolesComponent } from './project/edit/edit-roles/edit-roles.component';
import { EditUsersComponent } from './project/edit/edit-users/edit-users.component';
import { MarkTasksComponent } from './project/planning/mark-tasks/mark-tasks.component';
import { PlanningComponent } from './project/planning/planning.component';
import { ScrumPokerComponent } from './project/planning/scrum-poker/scrum-poker.component';
import { ProjectBacklogComponent } from './project/project-backlog/project-backlog.component';
import { ProjectBoardComponent } from './project/project-board/project-board.component';
import { TaskAcceptanceCriteriaComponent } from './project/project-board/task/task-acceptance-criteria/task-acceptance-criteria.component';
import { TaskCommentsComponent } from './project/project-board/task/task-comments/task-comments.component';
import { TaskHistoryComponent } from './project/project-board/task/task-history/task-history.component';
import { TaskComponent } from './project/project-board/task/task.component';
import { ProjectComponent } from './project/project.component';
import { RetroComponent } from './project/retro/retro.component';
import { ResetPasswordComponent } from './security/reset-password/reset-password.component';
import { SignInComponent } from './security/sign-in/sign-in.component';
import { SingUpComponent } from './security/sing-up/sing-up.component';
import { AuthGuard } from './utils/auth.guard';
import { PermissionGuard } from './utils/permission.guard';

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
    canActivate: [AuthGuard],
  },
  {
    path: 'create-project',
    component: CreateComponent,
    canActivate: [AuthGuard],
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
        path: 'planning/:planningId',
        component: PlanningComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: MarkTasksComponent,
          },
          {
            path: 'task/:taskId',
            component: ScrumPokerComponent,
          },
        ],
      },
      {
        path: 'demo/:demoId',
        component: DemoComponent,
      },
      {
        path: 'retro/:retroId',
        component: RetroComponent,
      },
      {
        path: 'daily',
        component: DailyComponent,
      },
      {
        path: 'task/:taskId',
        component: TaskComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'comments',
          },
          {
            path: 'comments',
            component: TaskCommentsComponent,
          },
          {
            path: 'acceptance-criteria',
            component: TaskAcceptanceCriteriaComponent,
          },
          {
            path: 'history',
            component: TaskHistoryComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'project/:id/edit',
    component: CreateComponent,
    canActivate: [PermissionGuard],
    data: {
      roles: [
        Permissions.CanEditProject,
        Permissions.CanCreateEpics,
        Permissions.CanCreateProjectRole,
        Permissions.CanEditProjectTeam,
      ],
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'info',
      },
      {
        path: 'info',
        component: EditProjectFormComponent,
        data: {
          roles: [Permissions.CanEditProject],
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'epics',
        component: EditEpicsComponent,
        data: {
          roles: [Permissions.CanCreateEpics],
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'roles',
        component: EditRolesComponent,
        data: {
          roles: [Permissions.CanCreateProjectRole],
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'users',
        component: EditUsersComponent,
        data: {
          roles: [Permissions.CanEditProjectTeam],
        },
        canActivate: [PermissionGuard],
      },
    ],
  },

  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
