import projectService from '../../services/project-service';

export default async (userId: number, projectId: number) => {
  return projectService.get(userId, projectId);
};
