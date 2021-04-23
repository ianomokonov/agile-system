import projectService from '../../services/project-service';

export default async (projectId: number, userId: number) => {
  return projectService.read(projectId, userId);
};
