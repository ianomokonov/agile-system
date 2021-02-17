import { CreateProjectRequest } from '../models/create-project-request';
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

  public async get(userId: number, projectId: number) {
    const project = projectRepository.getUserProject(userId, projectId);

    return project;
  }

  public async checkPermission(userId: number, projectId: number, permission: Permissions) {
    return projectRepository.checkUserPermission(userId, projectId, permission);
  }
}

export default new ProjectService();
