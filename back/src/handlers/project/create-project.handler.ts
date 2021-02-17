import { Project } from '../../models/project';
import projectService from '../../services/project-service';

export default async (userId: number, project: Project) => {
  return projectService.create(userId, project);
};
