import { StatusCodes } from 'http-status-codes';
import { Permissions } from '../models/permissions';
import projectService from '../services/project-service';

export default (permission: Permissions) => async (req, res, next): Promise<any> => {
  const { projectId } = req.params;
  const { userId } = res.locals;
  res.locals.projectId = projectId;
  const hasPermission = await projectService.checkPermission(userId, projectId, permission);

  if (!hasPermission) {
    return res.status(StatusCodes.FORBIDDEN).json('Действие в проекте запрещено');
  }

  next();
  return null;
};
