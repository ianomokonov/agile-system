import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import planningHandler from '../handlers/planning.handler';
import logger from '../logger';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../models/permissions';

const planningRouter = Router({ mergeParams: true });
planningRouter.use(checkProjectPermissions(Permissions.CanReadProject));

planningRouter.put(
  `/:planningId/update`,
  checkProjectPermissions(Permissions.CanStartSprint),
  async (req, res) => {
    await planningHandler.update(+req.params.planningId, req.body);
    res.status(StatusCodes.OK).json('Планирование изменено');
  },
);

planningRouter.post(
  `/start`,
  checkProjectPermissions(Permissions.CanStartSprint),
  async (req, res) => {
    const id = await planningHandler.start(res.locals.projectId, req.body.sprintId);
    res.status(StatusCodes.OK).json(id);
  },
);

planningRouter.get(`/:planningId`, async (req, res) => {
  try {
    const planning = await planningHandler.read(+req.params.planningId);
    res.status(StatusCodes.OK).json(planning);
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode || 500).json(error);
  }
});

planningRouter.get(`/:planningId/task/:taskId`, async (req, res) => {
  try {
    const planning = await planningHandler.getPlanningTaskSession(
      +req.params.taskId,
      res.locals.userId,
    );
    res.status(StatusCodes.OK).json(planning);
  } catch (error) {
    res.status(error.statusCode || 500).json(error);
  }
});

export default planningRouter;
