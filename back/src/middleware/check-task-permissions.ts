import { StatusCodes } from 'http-status-codes';
import projectService from '../services/project-service';
import taskService from '../services/task-service';
import { Permissions } from '../utils';

export default (permission: Permissions) => async (req, res, next): Promise<any> => {
  const { id: taskId } = req.params;
  const { userId } = res.locals.user;
  const projectId = await taskService.getTaskProjectId(taskId);
  const hasPermission = await projectService.checkPermission(userId, projectId, permission);

  if (!hasPermission) {
    return res.sendStatus(StatusCodes.FORBIDDEN);
  }

  next();
  return null;
};
