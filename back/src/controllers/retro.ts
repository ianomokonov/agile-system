import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import retroHandler from '../handlers/retro.handler';
import logger from '../logger';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../utils';

const retroRouter = Router({ mergeParams: true });
retroRouter.use(checkProjectPermissions(Permissions.CanReadProject));

retroRouter.post(`/start`, async (req, res) => {
  const { sprintId } = req.body;
  const id = await retroHandler.start(sprintId);
  res.status(StatusCodes.OK).json(id);
});

retroRouter.get(`/:retroId`, async (req, res) => {
  try {
    const retro = await retroHandler.read(+req.params.retroId, res.locals.userId);
    res.status(StatusCodes.OK).json(retro);
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode).json(error.error);
  }
});

export default retroRouter;
