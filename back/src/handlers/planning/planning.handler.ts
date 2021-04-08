import { PlanningUpdateRequest } from '../../models/requests/planning-update.request';
import planningService from '../../services/planning-service';
import projectService from '../../services/project-service';

export class PlanningHandler {
  public async start(projectId: number, sprintId: number, activeSprintId: number) {
    return planningService.start(projectId, sprintId, activeSprintId);
  }

  public async getList(projectId: number) {
    return planningService.getList(projectId);
  }

  public async read(planningId: number) {
    return planningService.read(planningId);
  }

  public async update(planningId: number, request: PlanningUpdateRequest) {
    return planningService.update(planningId, request);
  }

  public async finish(sprintId: number) {
    return projectService.finishSprint(sprintId);
  }
}

export default new PlanningHandler();
