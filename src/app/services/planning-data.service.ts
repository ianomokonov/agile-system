import { Injectable } from '@angular/core';
import { PlanningFullView } from 'back/src/models/responses/planning';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProjectService } from './project.service';

@Injectable()
export class PlanningDataService {
  public planning: PlanningFullView | undefined;
  constructor(private projectService: ProjectService) {}

  public getPlanning(projectId: number, planningId: number, forceUpdate: boolean = false) {
    if (!forceUpdate && this.planning?.id === +planningId) {
      return of(this.planning);
    }
    return this.projectService.getPlanning(projectId, planningId).pipe(
      tap((planning) => {
        this.planning = planning;
      }),
    );
  }
}
