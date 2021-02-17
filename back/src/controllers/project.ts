import { Router } from 'express';
import createProjectHandler from '../handlers/project/create-project.handler';
import authJWT from '../middleware/authJWT';

const projectRouter = Router();

projectRouter.get(`/:id`, authJWT, async (req, res) => {
  const { userId } = res.locals.user;
  res.json({ message: 'Проект ОК' });
});

projectRouter.post(`/create`, async (req, res) => {
  // const { userId } = res.locals.user;
  const projectId = await createProjectHandler(1, req.body);
  res.json({ id: projectId });
});

export default projectRouter;
