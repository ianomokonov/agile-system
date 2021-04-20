import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import demoHandler from '../handlers/demo.handler';
import logger from '../logger';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../utils';

const demoRouter = Router({ mergeParams: true });
demoRouter.use(checkProjectPermissions(Permissions.CanEditProject));

demoRouter.post(`/start`, async (req, res) => {
  const { sprintId } = req.body;
  const demoId = await demoHandler.start(res.locals.projectId, sprintId);
  res.status(StatusCodes.OK).json(demoId);
});

demoRouter.get(`/:demoId`, async (req, res) => {
  try {
    const planning = await demoHandler.read(+req.params.demoId);
    res.status(StatusCodes.OK).json(planning);
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode).json(error.error);
  }
});

demoRouter.delete(`/:demoId/finish`, async (req, res) => {
  await demoHandler.finishDemo(+req.params.demoId);
  res.status(StatusCodes.OK).json('Демо завершено');
});

demoRouter.delete(`/finish-task/:demoTaskId`, async (req, res) => {
  await demoHandler.finishTask(+req.params.demoTaskId);
  res.status(StatusCodes.OK).json('Задача обновлена');
});

export default demoRouter;
