import { CreateProjectRequest } from '../../models/requests/create-project-request';
import projectService from '../../services/project-service';

export class EditProjectHandler {
  public async update(projectId: number, request: CreateProjectRequest) {
    return projectService.update(projectId, request);
  }
  public async delete(projectId: number) {
    return projectService.delete(projectId);
  }
}

export default new EditProjectHandler();
