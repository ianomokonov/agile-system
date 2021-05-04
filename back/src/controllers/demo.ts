import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import demoHandler from '../handlers/demo.handler';
import logger from '../logger';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../models/permissions';

const demoRouter = Router({ mergeParams: true });

demoRouter.post(`/start`, checkProjectPermissions(Permissions.CanStartDemo), async (req, res) => {
  const { sprintId } = req.body;
  const demoId = await demoHandler.start(res.locals.projectId, sprintId);
  res.status(StatusCodes.OK).json(demoId);
});

demoRouter.get(
  `/:demoId`,
  checkProjectPermissions(Permissions.CanReadProject),
  async (req, res) => {
    try {
      const planning = await demoHandler.read(+req.params.demoId);
      res.status(StatusCodes.OK).json(planning);
    } catch (error) {
      logger.error(error);
      res.status(error.statusCode).json(error.error);
    }
  },
);

export default demoRouter;
