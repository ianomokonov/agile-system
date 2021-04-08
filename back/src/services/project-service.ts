import { AddProjectUserRequest } from '../models/requests/add-project-user-request';
import { CreateProjectRequest } from '../models/requests/create-project-request';
import { CreateSprintRequest } from '../models/requests/create-sprint.request';
import { EditProjectUserRequest } from '../models/requests/edit-project-user-request';
import {
  CreateProjectRoleRequest,
  UpdateProjectRoleRequest,
} from '../models/requests/project-role.models';
import { Backlog } from '../models/responses/backlog';
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
    const [project, sprint, statuses, users] = await Promise.all([
      projectRepository.getProject(projectId),
      projectRepository.getProjectActiveSprint(projectId),
      projectRepository.getProjectStatuses(),
      projectRepository.getFullProjectUsers(projectId),
    ]);
    project.sprint = sprint;
    project.statuses = statuses;
    project.users = users;
    return project;
  }

  public async update(projectId: number, project: CreateProjectRequest) {
    projectRepository.editProject(projectId, project);
  }

  public async getBacklog(projectId: number) {
    const [sprints, tasks] = await Promise.all([
      projectRepository.getProjectSprints(projectId),
      projectRepository.getSprintTasks(projectId),
    ]);

    return { sprints, tasks } as Backlog;
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

  public async createSprint(request: CreateSprintRequest, projectId: number) {
    return projectRepository.createSprint(request, projectId);
  }

  public async getProjectSprintNames(projectId: number) {
    return projectRepository.getProjectSprintNames(projectId);
  }

  public async startSprint(sprintId: number, projectId: number) {
    return projectRepository.startSprint(sprintId, projectId);
  }

  public async finishSprint(sprintId: number) {
    return projectRepository.finishSprint(sprintId);
  }
}

export default new ProjectService();
