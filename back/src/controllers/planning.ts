import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import planningHandler from '../handlers/planning.handler';
import logger from '../logger';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../models/permissions';

const planningRouter = Router({ mergeParams: true });
planningRouter.use(checkProjectPermissions(Permissions.CanReadProject));

planningRouter.post(
  `/start`,
  checkProjectPermissions(Permissions.CanStartDemo),
  async (req, res) => {
    const { sprintId, activeSprintId } = req.body;
    const planningId = await planningHandler.start(res.locals.projectId, sprintId, activeSprintId);
    res.status(StatusCodes.OK).json(planningId);
  },
);

planningRouter.get(`/:planningId`, async (req, res) => {
  try {
    const planning = await planningHandler.read(+req.params.planningId);
    res.status(StatusCodes.OK).json(planning);
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode).json(error.error);
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
    res.status(error.statusCode).json(error.error);
  }
});

export default planningRouter;
