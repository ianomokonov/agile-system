import { PlanningUpdateRequest } from '../models/requests/planning-update.request';
import planningService from '../services/planning-service';
import projectService from '../services/project-service';

export class PlanningHandler {
  public async start(projectId: number, sprintId: number, activeSprintId?: number) {
    return planningService.start(projectId, sprintId, activeSprintId);
  }

  public async read(planningId: number) {
    return planningService.read(planningId);
  }

  public async getPlanningTaskSession(taskId: number, userId: number) {
    return planningService.getSession(taskId, userId);
  }

  public async update(planningId: number, request: PlanningUpdateRequest) {
    return planningService.update(planningId, request);
  }

  public async reset(sessionId: number, taskId: number, userId: number) {
    return planningService.reset(sessionId, taskId, userId);
  }

  public async setShowCards(sessionId: number, showCards: boolean) {
    return planningService.setShowCards(sessionId, showCards);
  }

  public async finish(sprintId: number) {
    return projectService.finishSprint(sprintId);
  }

  public async setCard(sessionId: number, userId: number, value: number) {
    return planningService.setCard(sessionId, userId, value);
  }

  public async closeSession(sessionId: number, value: number, taskId: number, userId: number) {
    return planningService.closeSession(sessionId, value, taskId, userId);
  }
}

export default new PlanningHandler();
