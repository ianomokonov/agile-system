import projectService from '../../services/project-service';

export default async () => {
  return projectService.getPermissions();
};
