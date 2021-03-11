import { AddProjectUserRequest } from '../models/add-project-user-request';
import { CreateProjectRequest } from '../models/create-project-request';
import { EditProjectUserRequest } from '../models/edit-project-user-request';
import { CreateProjectRoleRequest, UpdateProjectRoleRequest } from '../models/project-role.models';
import projectRepository from '../repositories/project.repository';
import { Permissions } from '../utils';

class ProjectService {
  public async create(userId: number, project: CreateProjectRequest) {
    const projectId = await projectRepository.create(userId, project);
    await Promise.all([
      projectRepository.createProjectUsers(projectId, project.usersIds),
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

  public async read(projectId: number) {
    const [project, tasks] = await Promise.all([
      projectRepository.getProject(projectId),
      projectRepository.getProjectTasks(projectId),
    ]);
    project.tasks = tasks;
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
