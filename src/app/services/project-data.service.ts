import { Injectable } from '@angular/core';
import { ProjectResponse } from 'back/src/models/responses/project.response';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectDataService {
  public project: ProjectResponse;
  public PID: { [name: string]: boolean } = {};
  constructor(private projectService: ProjectService) {}

  public getProject(projectId: number, forceUpdate: boolean = false) {
    if (!forceUpdate && this.project?.id === +projectId) {
      return of(this.project);
    }
    return this.projectService.getProject(projectId).pipe(
      tap((project) => {
        this.project = project;
      }),
    );
  }

  public setPID(permissions: number[]) {
    permissions.forEach((p) => {
      this.PID[p.toString()] = true;
    });
  }
}
