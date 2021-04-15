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

retroRouter.delete(`/:retroId/finish`, async (req, res) => {
  await retroHandler.finish(+req.params.retroId);
  res.status(StatusCodes.OK).json('Демо завершено');
});

retroRouter.post(`/update-card/:cardId`, async (req, res) => {
  await retroHandler.updateCard(+req.params.cardId, req.body);
  res.status(StatusCodes.OK).json('Задача обновлена');
});

retroRouter.post(`/remove-card/:cardId`, async (req, res) => {
  await retroHandler.removeCard(+req.params.cardId);
  res.status(StatusCodes.OK).json('Карточка удалена');
});

retroRouter.put(`/:retroId/create-card`, async (req, res) => {
  const cardId = await retroHandler.createCard(+req.params.retroId, {
    ...req.body,
    userId: res.locals.userId,
  });
  res.status(StatusCodes.OK).json(cardId);
});

export default retroRouter;
