import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddProjectUserRequest } from 'back/src/models/requests/add-project-user-request';
import { CreateProjectRequest } from 'back/src/models/requests/create-project-request';
import { EditProjectUserRequest } from 'back/src/models/requests/edit-project-user-request';
import {
  CreateProjectRoleRequest,
  UpdateProjectRoleRequest,
} from 'back/src/models/requests/project-role.models';
import { ProjectResponse } from 'back/src/models/responses/project.response';
import { ProjectRoleResponse } from 'back/src/models/responses/project-role.response';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProjectEditInfo } from 'back/src/models/responses/project-edit-info';
import { Backlog } from 'back/src/models/responses/backlog';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { CreateSprintRequest } from 'back/src/models/requests/create-sprint.request';
import { IdNameResponse } from 'back/src/models/responses/id-name.response';
import { PlanningFullView } from 'back/src/models/responses/planning';
import { PlanningUpdateRequest } from 'back/src/models/requests/planning-update.request';

@Injectable()
export class ProjectService {
  private readonly baseUrl = `${environment.baseUrl}/project`;
  constructor(private http: HttpClient) {}

  public getProject(projectId: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.baseUrl}/${projectId}`);
  }

  public updateProject(projectId: number, request: CreateProjectRequest): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/${projectId}`, request);
  }

  public getProjectEditInfo(projectId: number): Observable<ProjectEditInfo> {
    return this.http.get<ProjectEditInfo>(`${this.baseUrl}/${projectId}/get-edit-info`);
  }

  public createProject(project: CreateProjectRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/create`, project);
  }

  public addProjectUser(projectId: number, user: AddProjectUserRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${projectId}/add-user`, user);
  }

  public getProjectUsers(projectId: number): Observable<UserShortView[]> {
    return this.http.get<UserShortView[]>(`${this.baseUrl}/${projectId}/users`);
  }

  public editProjectUser(projectId: number, user: EditProjectUserRequest): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${projectId}/edit-user`, user);
  }

  public removeProjectUser(projectId: number, userId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/${projectId}/remove-user?projectUserId=${userId}`,
    );
  }

  public addProjectRole(projectId: number, role: CreateProjectRoleRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${projectId}/add-role`, role);
  }

  public editProjectRole(projectId: number, role: UpdateProjectRoleRequest): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${projectId}/edit-role`, role);
  }

  public removeProjectRole(projectId: number, roleId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/${projectId}/remove-role?projectRoleId=${roleId}`,
    );
  }

  public getProjectRoles(projectId: number): Observable<ProjectRoleResponse[]> {
    return this.http.get<ProjectRoleResponse[]>(`${this.baseUrl}/${projectId}/roles`);
  }

  public getUserPermissions(projectId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/${projectId}/permissions`);
  }

  public getProjectBacklog(projectId: number): Observable<Backlog> {
    return this.http.get<Backlog>(`${this.baseUrl}/${projectId}/backlog`);
  }

  public addSprint(projectId: number, sprint: CreateSprintRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/${projectId}/sprint/create`, sprint);
  }

  public getProjectSprints(projectId: number): Observable<IdNameResponse[]> {
    return this.http.get<IdNameResponse[]>(`${this.baseUrl}/${projectId}/sprints`);
  }

  public finishSprint(projectId: number, sprintId: number): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/${projectId}/sprint/finish`, { id: sprintId });
  }

  public startSprint(projectId: number, sprintId: number): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/${projectId}/sprint/start`, { id: sprintId });
  }

  public startPlanning(
    projectId: number,
    sprintId: number,
    activeSprintId: number,
  ): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/${projectId}/planning/start`, {
      sprintId,
      activeSprintId,
    });
  }

  public getPlanning(projectId: number, planningId: number): Observable<PlanningFullView> {
    return this.http
      .get<PlanningFullView>(`${this.baseUrl}/${projectId}/planning/${planningId}`)
      .pipe(
        tap((planning) => {
          planning.notMarkedTasks.forEach((taskTemp) => {
            const task = taskTemp;
            task.activeSessionId = planning.activeSessions.find((as) => as.taskId === task.id)?.id;
          });
        }),
      );
  }

  public getPlanningSession(
    projectId: number,
    planningId: number,
    taskId: number,
  ): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${projectId}/planning/${planningId}/task/${taskId}`);
  }

  public setSessionCard(projectId: number, sessionId: number, value: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${projectId}/planning/${sessionId}/set-card`, {
      value,
    });
  }

  public closeSession(
    projectId: number,
    sessionId: number,
    value: number,
    taskId: number,
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${projectId}/planning/${sessionId}/close`, {
      value,
      taskId,
    });
  }

  public updatePlanning(
    projectId: number,
    planningId: number,
    request: PlanningUpdateRequest,
  ): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/${projectId}/planning/${planningId}/update`,
      request,
    );
  }

  public resetCards(projectId: number, sessionId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${projectId}/planning/${sessionId}/reset`);
  }

  public setShowCards(projectId: number, sessionId: number, showCards: boolean): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/${projectId}/planning/${sessionId}/set-show-cards`,
      {
        showCards,
      },
    );
  }
}
