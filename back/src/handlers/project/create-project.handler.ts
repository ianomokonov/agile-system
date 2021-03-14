import { CreateProjectRequest } from '../../models/requests/create-project-request';
import projectService from '../../services/project-service';

export default async (userId: number, project: CreateProjectRequest) => {
  return projectService.create(userId, project);
};
