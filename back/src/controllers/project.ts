import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import addProjectUserHandler from '../handlers/project/add-project-user.handler';
import createProjectHandler from '../handlers/project/create-project.handler';
import editProjectUserHandler from '../handlers/project/edit-project-user.handler';
import getProjectPermissionsHandler from '../handlers/project/get-project-permissions.handler';
import getProjectHandler from '../handlers/project/get-project.handler';
import projectRolesHandler from '../handlers/project/project-roles.handler';
import removeProjectUserHandler from '../handlers/project/remove-project-user.handler';
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
    await addProjectUserHandler(req.body);
    res.status(StatusCodes.OK).json('Пользователь добавлен');
  },
);

projectRouter.put(
  `/:id/edit-user`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await editProjectUserHandler(req.body);
    res.status(StatusCodes.OK).json('Пользователь обновлен');
  },
);

projectRouter.delete(
  `/:id/remove-user`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await removeProjectUserHandler(+req.query.projectUserId);
    res.status(StatusCodes.OK).json('Пользователь удален');
  },
);

projectRouter.post(
  `/:id/add-role`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectRolesHandler.create({ projectId: req.params.id, ...req.body });
    res.status(StatusCodes.OK).json('Роль добавлена');
  },
);

projectRouter.put(
  `/:id/edit-role`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectRolesHandler.update({ projectId: req.params.id, ...req.body });
    res.status(StatusCodes.OK).json('Роль обновлена');
  },
);

projectRouter.delete(
  `/:id/remove-role`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectRolesHandler.delete(+req.query.projectRoleId);
    res.status(StatusCodes.OK).json('Роль удалена');
  },
);

projectRouter.get(
  `/:id/roles`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    const roles = await projectRolesHandler.read(+req.params.id);
    res.status(StatusCodes.OK).json(roles);
  },
);

projectRouter.get(
  `/:id/permissions`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    const permissions = await getProjectPermissionsHandler();
    res.status(StatusCodes.OK).json(permissions);
  },
);

export default projectRouter;
