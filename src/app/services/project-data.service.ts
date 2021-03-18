import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectDataService {
  public projectId: number;
  constructor(private projectService: ProjectService) {}

  public getProject(projectId: number) {
    return this.projectService.getProject(projectId).pipe(
      tap(() => {
        this.projectId = projectId;
      }),
    );
  }
}
