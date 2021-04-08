import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import projectSprintHandler from '../handlers/project/project-sprint.handler';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../utils';

const sprintRouter = Router({ mergeParams: true });
sprintRouter.use(checkProjectPermissions(Permissions.CanEditProject));

sprintRouter.post(`/create`, async (req, res) => {
  const newPrintId = await projectSprintHandler.create(req.body, res.locals.projectId);
  res.status(StatusCodes.OK).json(newPrintId);
});

sprintRouter.post(`/start`, async (req, res) => {
  await projectSprintHandler.start(req.body.id, res.locals.projectId);
  res.status(StatusCodes.OK).json('Спринт стартовал');
});

sprintRouter.post(`/finish`, async (req, res) => {
  await projectSprintHandler.finish(req.body.id);
  res.status(StatusCodes.OK).json('Спринт завершен');
});

export default sprintRouter;
