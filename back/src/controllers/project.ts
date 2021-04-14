import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import createProjectHandler from '../handlers/project/create-project.handler';
import editProjectHandler from '../handlers/project/edit-project.handler';
import getProjectEditInfoHandler from '../handlers/project/get-project-edit-info.handler';
import getProjectPermissionsHandler from '../handlers/project/get-project-permissions.handler';
import getProjectHandler from '../handlers/project/get-project.handler';
import projectBacklogHandler from '../handlers/project/project-backlog.handler';
import projectRolesHandler from '../handlers/project/project-roles.handler';
import projectSprintHandler from '../handlers/project/project-sprint.handler';
import projectUsersHandler from '../handlers/project/project-users.handler';
import tasksHandler from '../handlers/task/tasks.handler';
import authJWT from '../middleware/authJWT';
import checkPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../utils';
import demoRouter from './demo';
import planningRouter from './planning';
import sprintRouter from './sprint';

const projectRouter = Router();
projectRouter.use(authJWT);

projectRouter.get(`/permissions`, async (req, res) => {
  const permissions = await getProjectPermissionsHandler();
  res.status(StatusCodes.OK).json(permissions);
});
projectRouter.get(`/:projectId`, checkPermissions(Permissions.CanReadProject), async (req, res) => {
  const project = await getProjectHandler(res.locals.projectId);

  if (!project) {
    res.status(StatusCodes.NOT_FOUND).json('Проект не найден');
    return;
  }
  res.status(StatusCodes.OK).json(project);
});

projectRouter.put(`/:projectId`, checkPermissions(Permissions.CanEditProject), async (req, res) => {
  await editProjectHandler(res.locals.projectId, req.body);
  res.status(StatusCodes.OK).json('Проект изменен');
});

projectRouter.get(
  `/:projectId/get-edit-info`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    const project = await getProjectEditInfoHandler(res.locals.projectId);

    if (!project) {
      res.status(StatusCodes.NOT_FOUND).json('Проект не найден');
      return;
    }
    res.status(StatusCodes.OK).json(project);
  },
);

projectRouter.post(`/create`, async (req, res) => {
  const { userId } = res.locals;
  const projectId = await createProjectHandler(userId, req.body);
  res.status(StatusCodes.CREATED).json(projectId);
});

projectRouter.post(
  `/:projectId/add-link`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.put(
  `/:projectId/edit-link`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.delete(
  `/:projectId/remove-link`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    res.json({ message: 'заглушка' });
  },
);

projectRouter.post(
  `/:projectId/add-user`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectUsersHandler.create(req.body);
    res.status(StatusCodes.CREATED).json('Пользователь добавлен');
  },
);

projectRouter.put(
  `/:projectId/edit-user`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectUsersHandler.update(req.body);
    res.status(StatusCodes.OK).json('Пользователь обновлен');
  },
);

projectRouter.delete(
  `/:projectId/remove-user`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectUsersHandler.delete(+req.query.projectUserId);
    res.status(StatusCodes.OK).json('Пользователь удален');
  },
);

projectRouter.get(
  `/:projectId/users`,
  checkPermissions(Permissions.CanReadProject),
  async (req, res) => {
    const users = await projectUsersHandler.read(res.locals.projectId);
    res.status(StatusCodes.OK).json(users);
  },
);

projectRouter.post(
  `/:projectId/add-role`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectRolesHandler.create({ projectId: res.locals.projectId, ...req.body });
    res.status(StatusCodes.OK).json('Роль добавлена');
  },
);

projectRouter.put(
  `/:projectId/edit-role`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectRolesHandler.update(req.body);
    res.status(StatusCodes.OK).json('Роль обновлена');
  },
);

projectRouter.delete(
  `/:projectId/remove-role`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectRolesHandler.delete(+req.query.projectRoleId);
    res.status(StatusCodes.OK).json('Роль удалена');
  },
);

projectRouter.get(
  `/:projectId/roles`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    const roles = await projectRolesHandler.read(res.locals.projectId);
    res.status(StatusCodes.OK).json(roles);
  },
);

projectRouter.get(
  `/:projectId/backlog`,
  checkPermissions(Permissions.CanReadProject),
  async (req, res) => {
    try {
      const backlog = await projectBacklogHandler(res.locals.projectId);
      res.status(StatusCodes.OK).json(backlog);
    } catch (error) {
      console.error(error);
    }
  },
);

projectRouter.get(
  `/:projectId/sprints`,
  checkPermissions(Permissions.CanReadProject),
  async (req, res) => {
    const sprints = await projectSprintHandler.getProjectSprints(res.locals.projectId);
    res.status(StatusCodes.OK).json(sprints);
  },
);

projectRouter.post(
  `/:projectId/add-task`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    const { userId } = res.locals;
    const newTaskId = await tasksHandler.create(res.locals.projectId, {
      ...req.body,
      creatorId: userId,
    });
    res.status(StatusCodes.OK).json(newTaskId);
  },
);

projectRouter.use('/:projectId/sprint', sprintRouter);
projectRouter.use('/:projectId/planning', planningRouter);
projectRouter.use('/:projectId/demo', demoRouter);

export default projectRouter;
