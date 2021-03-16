import { CreateProjectRequest } from '../../models/requests/create-project-request';
import projectService from '../../services/project-service';

export default async (projectId: number, request: CreateProjectRequest) => {
  return projectService.update(projectId, request);
};
