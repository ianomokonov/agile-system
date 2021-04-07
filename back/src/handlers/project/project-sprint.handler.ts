import { CreateSprintRequest } from '../../models/requests/create-sprint.request';
import projectService from '../../services/project-service';

export class ProjectSprintHandler {
  public async getProjectSprints(projectId: number) {
    return projectService.getProjectSprintNames(projectId);
  }
  public async create(request: CreateSprintRequest, projectId: number) {
    return projectService.createSprint(request, projectId);
  }
  public async start(sprintId: number) {
    return projectService.startSprint(sprintId);
  }
  public async finish(sprintId: number) {
    return projectService.finishSprint(sprintId);
  }
}

export default new ProjectSprintHandler();
