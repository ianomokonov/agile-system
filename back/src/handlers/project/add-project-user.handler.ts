import { AddProjectUserRequest } from '../../models/requests/add-project-user-request';
import projectService from '../../services/project-service';

export default async (request: AddProjectUserRequest) => {
  return projectService.addProjectUser(request);
};
