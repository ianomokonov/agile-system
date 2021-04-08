import { StatusCodes } from 'http-status-codes';
import projectService from '../services/project-service';
import { Permissions } from '../utils';

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
