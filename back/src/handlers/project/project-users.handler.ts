import { CRUD } from '../../models/crud.interface';
import { AddProjectUserRequest } from '../../models/requests/add-project-user-request';
import { EditProjectUserRequest } from '../../models/requests/edit-project-user-request';
import projectService from '../../services/project-service';

export class ProjectUserHandler implements CRUD<AddProjectUserRequest, EditProjectUserRequest> {
  public async create(request: AddProjectUserRequest) {
    return projectService.addProjectUser(request);
  }
  public async update(request: EditProjectUserRequest) {
    return projectService.editProjectUser(request);
  }
  public async read(projectId: number) {
    return projectService.getProjectUsers(projectId);
  }
  public async delete(userId: number) {
    return projectService.removeProjectUser(userId);
  }
}

export default new ProjectUserHandler();
