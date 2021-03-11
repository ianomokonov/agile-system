import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import tasksHandler from '../handlers/task/tasks.handler';
import authJWT from '../middleware/authJWT';
import checkTaskPermissions from '../middleware/check-task-permissions';
import { Permissions } from '../utils';

const taskRouter = Router();
taskRouter.get(
  `/:id`,
  authJWT,
  checkTaskPermissions(Permissions.CanReadProject),
  async (req, res) => {
    const result = await tasksHandler.read(+req.params.id);
    res.json(result);
  },
);

taskRouter.put(
  `/:id/edit`,
  authJWT,
  checkTaskPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await tasksHandler.update({ id: +req.params.id, ...req.body });
    res.status(StatusCodes.OK).json('Задача обновлена');
  },
);

taskRouter.delete(
  `/:id/remove`,
  authJWT,
  checkTaskPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await tasksHandler.delete(+req.params.id);
    res.status(StatusCodes.OK).json('Задача удалена');
  },
);

export default taskRouter;
