import { AddProjectUserRequest } from '../models/requests/add-project-user-request';
import { CreateProjectRequest } from '../models/requests/create-project-request';
import { EditProjectUserRequest } from '../models/requests/edit-project-user-request';
import {
  CreateProjectRoleRequest,
  UpdateProjectRoleRequest,
} from '../models/requests/project-role.models';
import { ProjectEditInfo } from '../models/responses/project-edit-info';
import { ProjectResponse } from '../models/responses/project.response';
import projectRepository from '../repositories/project.repository';
import { Permissions } from '../utils';

class ProjectService {
  public async create(userId: number, project: CreateProjectRequest) {
    const projectId = await projectRepository.create(userId, project);
    await Promise.all([
      projectRepository.createProjectUsers(
        projectId,
        project.usersIds.filter((id) => id !== userId),
      ),
      projectRepository.createProjectLinks(projectId, project.links),
    ]);
    return projectId;
  }

  public async addProjectUser(request: AddProjectUserRequest) {
    return projectRepository.addProjectUser(request);
  }

  public async editProjectUser(request: EditProjectUserRequest) {
    return projectRepository.editProjectUser(request);
  }

  public async removeProjectUser(userId: number) {
    return projectRepository.removeProjectUser(userId);
  }

  public async addProjectRole(request: CreateProjectRoleRequest) {
    return projectRepository.addProjectRole(request);
  }

  public async editProjectRole(request: UpdateProjectRoleRequest) {
    return projectRepository.editProjectRole(request);
  }

  public async removeProjectRole(roleId: number) {
    return projectRepository.removeProjectRole(roleId);
  }

  public async getProjectRoles(projectId: number) {
    return projectRepository.getProjectRoles(projectId);
  }

  public async getProjectUsers(projectId: number) {
    return projectRepository.getFullProjectUsers(projectId);
  }

  public async read(projectId: number): Promise<ProjectResponse> {
    const [project, tasks, statuses] = await Promise.all([
      projectRepository.getProject(projectId),
      projectRepository.getProjectTasks(projectId),
      projectRepository.getProjectStatuses(),
    ]);
    project.tasks = tasks;
    project.statuses = statuses;
    return project;
  }

  public async update(projectId: number, project: CreateProjectRequest) {
    projectRepository.editProject(projectId, project);
  }

  public async getEditInfo(projectId: number): Promise<ProjectEditInfo> {
    const [project, users] = await Promise.all([
      projectRepository.getProject(projectId) as any,
      projectRepository.getProjectUsers(projectId),
    ]);
    project.users = users;
    return project;
  }

  public async getPermissions() {
    return projectRepository.getProjectPermissions();
  }

  public async checkPermission(userId: number, projectId: number, permission: Permissions) {
    return projectRepository.checkUserPermission(userId, projectId, permission);
  }
}

export default new ProjectService();
