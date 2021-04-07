import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import tasksHandler from '../handlers/task/tasks.handler';
import updateTaskStatusHandler from '../handlers/task/update-task-status.handler';
import logger from '../logger';
import authJWT from '../middleware/authJWT';
import checkTaskPermissions from '../middleware/check-task-permissions';
import { Permissions } from '../utils';

const taskRouter = Router();
taskRouter.get(
  `/:id`,
  authJWT,
  checkTaskPermissions(Permissions.CanReadProject),
  async (req, res) => {
    try {
      const result = await tasksHandler.read(+req.params.id);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      logger.error(error);
      res.status(error.statusCode).json(error.error);
    }
  },
);

taskRouter.put(
  `/:id/edit`,
  authJWT,
  checkTaskPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await tasksHandler.update({ id: +req.params.id, ...req.body });
      res.status(StatusCodes.OK).json('Задача обновлена');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

taskRouter.delete(
  `/:id/remove`,
  authJWT,
  checkTaskPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await tasksHandler.delete(+req.params.id);
      res.status(StatusCodes.OK).json('Задача удалена');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

taskRouter.put(
  `/:id/update-status`,
  authJWT,
  checkTaskPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await updateTaskStatusHandler(+req.params.id, req.body.statusId);
      res.status(StatusCodes.OK).json('Статус задачи обновлен');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

export default taskRouter;
