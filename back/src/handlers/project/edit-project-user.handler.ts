import { EditProjectUserRequest } from '../../models/requests/edit-project-user-request';
import projectService from '../../services/project-service';

export default async (request: EditProjectUserRequest) => {
  return projectService.editProjectUser(request);
};
