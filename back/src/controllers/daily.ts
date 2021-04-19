import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import dailyHandler from '../handlers/daily.handler';
import logger from '../logger';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../utils';

const dailyRouter = Router({ mergeParams: true });
dailyRouter.use(checkProjectPermissions(Permissions.CanEditProject));
dailyRouter.get(``, async (req, res) => {
  try {
    const daily = await dailyHandler.read(res.locals.projectId);
    res.status(StatusCodes.OK).json(daily);
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode).json(error.error);
  }
});

export default dailyRouter;
