import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import planningHandler from '../handlers/planning/planning.handler';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../utils';

const planningRouter = Router({ mergeParams: true });
planningRouter.use(checkProjectPermissions(Permissions.CanEditProject));

planningRouter.post(`/start`, async (req, res) => {
  const { sprintId, activeSprintId } = req.body;
  const planningId = await planningHandler.start(res.locals.projectId, sprintId, activeSprintId);
  res.status(StatusCodes.OK).json(planningId);
});

planningRouter.get(`/list`, async (req, res) => {
  const plannings = await planningHandler.getList(res.locals.projectId);
  res.status(StatusCodes.OK).json(plannings);
});

planningRouter.get(`/:planningId`, async (req, res) => {
  try {
    const planning = await planningHandler.read(+req.params.planningId);
    res.status(StatusCodes.OK).json(planning);
  } catch (error) {
    res.status(error.statusCode).json(error.error);
  }
});

planningRouter.put(`/:planningId/update`, async (req, res) => {
  await planningHandler.update(+req.params.planningId, req.body);
  res.status(StatusCodes.OK).json('Планирование обновлено');
});

export default planningRouter;
