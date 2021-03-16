import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import createProjectHandler from '../handlers/project/create-project.handler';
import getProjectPermissionsHandler from '../handlers/project/get-project-permissions.handler';
import getProjectHandler from '../handlers/project/get-project.handler';
import projectRolesHandler from '../handlers/project/project-roles.handler';
import projectUsersHandler from '../handlers/project/project-users.handler';
import tasksHandler from '../handlers/task/tasks.handler';
import authJWT from '../middleware/authJWT';
import checkPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../utils';

const projectRouter = Router();

projectRouter.get(
  `/:id`,
  authJWT,
  checkPermissions(Permissions.CanReadProject),
  async (req, res) => {
    try {
      const project = await getProjectHandler(Number.parseInt(req.params.id, 10));

      if (!project) {
        res.status(StatusCodes.NOT_FOUND).json('Проект не найден');
        return;
      }
      res.status(StatusCodes.OK).json(project);
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.post(`/create`, authJWT, async (req, res) => {
  const { userId } = res.locals;
  const projectId = await createProjectHandler(userId, req.body);
  res.status(StatusCodes.CREATED).json(projectId);
});

projectRouter.post(
  `/:id/add-link`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      res.json({ message: 'заглушка' });
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.put(
  `/:id/edit-link`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      res.json({ message: 'заглушка' });
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.delete(
  `/:id/remove-link`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      res.json({ message: 'заглушка' });
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.post(
  `/:id/add-user`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await projectUsersHandler.create(req.body);
      res.status(StatusCodes.CREATED).json('Пользователь добавлен');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.put(
  `/:id/edit-user`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await projectUsersHandler.update(req.body);
      res.status(StatusCodes.OK).json('Пользователь обновлен');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.delete(
  `/:id/remove-user`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await projectUsersHandler.delete(+req.query.projectUserId);
      res.status(StatusCodes.OK).json('Пользователь удален');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.get(
  `/:id/users`,
  authJWT,
  checkPermissions(Permissions.CanReadProject),
  async (req, res) => {
    try {
      const users = await projectUsersHandler.read(+req.params.id);
      res.status(StatusCodes.OK).json(users);
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.post(
  `/:id/add-role`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await projectRolesHandler.create({ projectId: req.params.id, ...req.body });
      res.status(StatusCodes.OK).json('Роль добавлена');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.put(
  `/:id/edit-role`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await projectRolesHandler.update({ projectId: req.params.id, ...req.body });
      res.status(StatusCodes.OK).json('Роль обновлена');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.delete(
  `/:id/remove-role`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await projectRolesHandler.delete(+req.query.projectRoleId);
      res.status(StatusCodes.OK).json('Роль удалена');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.get(
  `/:id/roles`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      const roles = await projectRolesHandler.read(+req.params.id);
      res.status(StatusCodes.OK).json(roles);
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

projectRouter.get(`/permissions`, authJWT, async (req, res) => {
  try {
    const permissions = await getProjectPermissionsHandler();
    res.status(StatusCodes.OK).json(permissions);
  } catch (error) {
    res.status(error.statusCode).json(error.error);
  }
});

projectRouter.post(
  `/:id/add-task`,
  authJWT,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      const newTaskId = await tasksHandler.create({ projectId: +req.params.id, ...req.body });
      res.status(StatusCodes.OK).json(newTaskId);
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

export default projectRouter;
