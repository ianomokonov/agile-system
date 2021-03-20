import { StatusCodes } from 'http-status-codes';
import projectService from '../services/project-service';
import { Permissions } from '../utils';

export default (permission: Permissions) => async (req, res, next): Promise<any> => {
  const { id: projectId } = req.params;
  const { userId } = res.locals;

  const hasPermission = await projectService.checkPermission(userId, projectId, permission);

  if (!hasPermission) {
    return res.sendStatus(StatusCodes.FORBIDDEN);
  }

  next();
  return null;
};
