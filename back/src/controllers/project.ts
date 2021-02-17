import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import createProjectHandler from '../handlers/project/create-project.handler';
import getProjectHandler from '../handlers/project/get-project.handler';
import authJWT from '../middleware/authJWT';
import checkPermissions from '../middleware/check-permissions';
import { Permissions } from '../utils';

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

projectRouter.post(
  `/:id/add-link`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.put(
  `/:id/edit-link`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.delete(
  `/:id/remove-link`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.post(
  `/:id/add-user`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.put(
  `/:id/edit-user`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.delete(
  `/:id/remove-user`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.post(
  `/:id/add-role`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.put(
  `/:id/edit-role`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.delete(
  `/:id/remove-role`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

export default projectRouter;
