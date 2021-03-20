import { Injectable } from '@angular/core';
import { ProjectResponse } from 'back/src/models/responses/project.response';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectDataService {
  public project: ProjectResponse;
  constructor(private projectService: ProjectService) {}

  public getProject(projectId: number) {
    if (this.project?.id === projectId) {
      return of(this.project);
    }
    return this.projectService.getProject(projectId).pipe(
      tap((project) => {
        this.project = project;
      }),
    );
  }
}
