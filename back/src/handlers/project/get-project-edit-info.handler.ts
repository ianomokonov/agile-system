import projectService from '../../services/project-service';

export default async (projectId: number) => {
  return projectService.getEditInfo(projectId);
};
