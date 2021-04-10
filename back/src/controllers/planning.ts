import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import planningHandler from '../handlers/planning/planning.handler';
import logger from '../logger';
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
    logger.error(error);
    res.status(error.statusCode).json(error.error);
  }
});

planningRouter.get(`/:planningId/task/:taskId`, async (req, res) => {
  try {
    const planning = await planningHandler.getPlanningTaskSession(
      +req.params.planningId,
      +req.params.taskId,
      res.locals.userId,
    );
    res.status(StatusCodes.OK).json(planning);
  } catch (error) {
    res.status(error.statusCode).json(error.error);
  }
});

planningRouter.put(`/:planningId/update`, async (req, res) => {
  await planningHandler.update(+req.params.planningId, req.body);
  res.status(StatusCodes.OK).json('Планирование обновлено');
});

planningRouter.put(`/:sessionId/set-card`, async (req, res) => {
  await planningHandler.setCard(+req.params.sessionId, res.locals.userId, req.body.value);
  res.status(StatusCodes.OK).json('Карточка сохранена');
});

planningRouter.post(`/:sessionId/close`, async (req, res) => {
  await planningHandler.closeSession(+req.params.sessionId, req.body.value, req.body.taskId);
  res.status(StatusCodes.OK).json('Сессия закрыта');
});

planningRouter.post(`/:sessionId/set-show-cards`, async (req, res) => {
  await planningHandler.setShowCards(+req.params.sessionId, req.body.showCards);
  res.status(StatusCodes.OK).json('Карточки открыты');
});

planningRouter.delete(`/:sessionId/reset`, async (req, res) => {
  await planningHandler.reset(+req.params.sessionId);
  res.status(StatusCodes.OK).json('Оценки сюрошены');
});

export default planningRouter;
