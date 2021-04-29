import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import projectSprintHandler from '../handlers/project/project-sprint.handler';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../models/permissions';

const sprintRouter = Router({ mergeParams: true });

sprintRouter.post(
  `/create`,
  checkProjectPermissions(Permissions.CanCreateSprint),
  async (req, res) => {
    const newPrintId = await projectSprintHandler.create(req.body, res.locals.projectId);
    res.status(StatusCodes.OK).json(newPrintId);
  },
);

sprintRouter.post(
  `/start`,
  checkProjectPermissions(Permissions.CanStartSprint),
  async (req, res) => {
    await projectSprintHandler.start(req.body.id, res.locals.projectId, res.locals.userId);
    res.status(StatusCodes.OK).json('Спринт стартовал');
  },
);

sprintRouter.post(
  `/finish`,
  checkProjectPermissions(Permissions.CanFinishSprint),
  async (req, res) => {
    await projectSprintHandler.finish(req.body.id);
    res.status(StatusCodes.OK).json('Спринт завершен');
  },
);

export default sprintRouter;
