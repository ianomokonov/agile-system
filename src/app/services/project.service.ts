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
import { ProjectPermissionResponse } from 'back/src/models/responses/permission.response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateTaskRequest } from 'back/src/models/requests/task.models';
import { ProjectEditInfo } from 'back/src/models/responses/project-edit-info';
import { Backlog } from 'back/src/models/responses/backlog';
import { UserShortView } from 'back/src/models/responses/user-short-view';

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

  public getPermissions(): Observable<ProjectPermissionResponse[]> {
    return this.http.get<ProjectPermissionResponse[]>(`${this.baseUrl}/permissions`);
  }

  public getProjectBacklog(projectId: number): Observable<Backlog> {
    return this.http.get<Backlog>(`${this.baseUrl}/${projectId}/backlog`);
  }

  public addTask(
    projectId: number,
    task: CreateTaskRequest,
  ): Observable<ProjectPermissionResponse[]> {
    return this.http.post<ProjectPermissionResponse[]>(
      `${this.baseUrl}/${projectId}/add-task`,
      task,
    );
  }
}
