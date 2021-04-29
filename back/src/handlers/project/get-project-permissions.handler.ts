import projectService from '../../services/project-service';

export default async (userId, projectId) => {
  return projectService.getUserPermissions(userId, projectId);
};
