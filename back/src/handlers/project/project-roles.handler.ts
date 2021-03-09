import { CRUD } from '../../models/crud.interface';
import {
  CreateProjectRoleRequest,
  UpdateProjectRoleRequest,
} from '../../models/project-role.models';
import projectService from '../../services/project-service';

export class ProjectRoleHandler
  implements CRUD<CreateProjectRoleRequest, UpdateProjectRoleRequest> {
  public async create(request: CreateProjectRoleRequest) {
    return projectService.addProjectRole(request);
  }
  public async update(request: UpdateProjectRoleRequest) {
    return projectService.editProjectRole(request);
  }
  public async read(projectId: number) {
    return projectService.getProjectRoles(projectId);
  }
  public async delete(roleId: number) {
    return projectService.removeProjectRole(roleId);
  }
}

export default new ProjectRoleHandler();
