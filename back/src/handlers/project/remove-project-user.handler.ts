import projectService from '../../services/project-service';

export default async (userId: number) => {
  return projectService.removeProjectUser(userId);
};
