import { StatusCodes } from 'http-status-codes';
import projectService from '../services/project-service';
import taskService from '../services/task-service';
import { Permissions } from '../utils';

export default (permission: Permissions) => async (req, res, next): Promise<any> => {
  const { id: taskId } = req.params;
  const { userId } = res.locals;
  const projectId = await taskService.getTaskProjectId(taskId);
  if (!projectId) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
  const hasPermission = await projectService.checkPermission(userId, projectId, permission);

  if (!hasPermission) {
    return res.sendStatus(StatusCodes.FORBIDDEN);
  }

  next();
  return null;
};
