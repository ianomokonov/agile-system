import projectService from '../services/project-service';
import { Permissions } from '../utils';

export default async (projectId: number, userId: number, permission: Permissions) => {
  const hasPermission = await projectService.checkPermission(userId, projectId, permission);
  return !!hasPermission;
};
