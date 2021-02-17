import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import createProjectHandler from '../handlers/project/create-project.handler';
import getProjectHandler from '../handlers/project/get-project.handler';
import authJWT from '../middleware/authJWT';
import canEditProject from '../middleware/can-edit-project';

const projectRouter = Router();

projectRouter.get(`/:id`, authJWT, async (req, res) => {
  const { userId } = res.locals.user;
  const project = await getProjectHandler(userId, Number.parseInt(req.params.id, 10));

  if (!project) {
    res.status(StatusCodes.NOT_FOUND).json('Проект не найден');
    return;
  }
  res.status(StatusCodes.OK).json(project);
});

projectRouter.post(`/create`, authJWT, async (req, res) => {
  const { userId } = res.locals.user;
  const projectId = await createProjectHandler(userId, req.body);
  res.json({ id: projectId });
});

projectRouter.put(`/update-links`, authJWT, canEditProject, async (req, res) => {
  const { userId } = res.locals.user;
  const projectId = await createProjectHandler(userId, req.body);
  res.json({ id: projectId });
});

projectRouter.put(`/update-users`, authJWT, canEditProject, async (req, res) => {
  const { userId } = res.locals.user;
  const projectId = await createProjectHandler(userId, req.body);
  res.json({ id: projectId });
});

projectRouter.put(`/update-roles`, authJWT, canEditProject, async (req, res) => {
  const { userId } = res.locals.user;
  const projectId = await createProjectHandler(userId, req.body);
  res.json({ id: projectId });
});

export default projectRouter;
