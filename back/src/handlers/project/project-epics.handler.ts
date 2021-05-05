import projectService from '../../services/project-service';
import {
  CreateProjectEpicRequest,
  UpdateProjectEpicRequest,
} from '../../models/requests/project-epic.models';

export class ProjectEpicHandler {
  public async create(projectId: number, request: CreateProjectEpicRequest) {
    return projectService.addProjectEpic(projectId, request);
  }
  public async update(request: UpdateProjectEpicRequest) {
    return projectService.editProjectEpic(request);
  }
  public async read(projectId: number) {
    return projectService.getProjectEpics(projectId);
  }
  public async delete(epicId: number) {
    return projectService.removeProjectEpic(epicId);
  }
}

export default new ProjectEpicHandler();
