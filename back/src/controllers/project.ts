import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import createProjectHandler from '../handlers/project/create-project.handler';
import editProjectHandler from '../handlers/project/edit-project.handler';
import getProjectEditInfoHandler from '../handlers/project/get-project-edit-info.handler';
import getProjectPermissionsHandler from '../handlers/project/get-project-permissions.handler';
import getProjectHandler from '../handlers/project/get-project.handler';
import projectBacklogHandler from '../handlers/project/project-backlog.handler';
import projectEpicsHandler from '../handlers/project/project-epics.handler';
import projectRolesHandler from '../handlers/project/project-roles.handler';
import projectSprintHandler from '../handlers/project/project-sprint.handler';
import projectUsersHandler from '../handlers/project/project-users.handler';
import tasksHandler from '../handlers/task/tasks.handler';
import authJWT from '../middleware/authJWT';
import checkPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../models/permissions';
import dailyRouter from './daily';
import demoRouter from './demo';
import planningRouter from './planning';
import retroRouter from './retro';
import sprintRouter from './sprint';
import taskRouter from './task';

const projectRouter = Router();
projectRouter.use(authJWT);

projectRouter.get(`/:projectId`, checkPermissions(Permissions.CanReadProject), async (req, res) => {
  const project = await getProjectHandler(res.locals.projectId, res.locals.userId);

  if (!project) {
    res.status(StatusCodes.NOT_FOUND).json('Проект не найден');
    return;
  }
  res.status(StatusCodes.OK).json(project);
});

projectRouter.put(`/:projectId`, checkPermissions(Permissions.CanEditProject), async (req, res) => {
  await editProjectHandler.update(res.locals.projectId, req.body);
  res.status(StatusCodes.OK).json('Проект изменен');
});

projectRouter.delete(
  `/:projectId`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await editProjectHandler.delete(res.locals.projectId);
    res.status(StatusCodes.OK).json('Проект удален');
  },
);

projectRouter.get(`/:projectId/permissions`, async (req, res) => {
  const permissions = await getProjectPermissionsHandler(res.locals.userId, +req.params.projectId);
  res.status(StatusCodes.OK).json(permissions);
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
  try {
    const { userId } = res.locals;
    const projectId = await createProjectHandler(userId, req.body);
    res.status(StatusCodes.CREATED).json(projectId);
  } catch (error) {
    res.status(error.statusCode || 500).json(error);
  }
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
    try {
      await projectUsersHandler.create(req.body);
      res.status(StatusCodes.CREATED).json('Пользователь добавлен');
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
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
    const users = await projectUsersHandler.read(res.locals.projectId, res.locals.userId);
    res.status(StatusCodes.OK).json(users);
  },
);

projectRouter.get(
  `/:projectId/epics`,
  checkPermissions(Permissions.CanReadProject),
  async (req, res) => {
    const epics = await projectEpicsHandler.read(res.locals.projectId);
    res.status(StatusCodes.OK).json(epics);
  },
);

projectRouter.post(
  `/:projectId/add-epic`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    try {
      await projectEpicsHandler.create(res.locals.projectId, req.body);
      res.status(StatusCodes.CREATED).json('Пользователь добавлен');
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
  },
);

projectRouter.put(
  `/:projectId/edit-epic`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectEpicsHandler.update(req.body);
    res.status(StatusCodes.OK).json('Пользователь обновлен');
  },
);

projectRouter.delete(
  `/:projectId/remove-epic`,
  checkPermissions(Permissions.CanEditProject),
  async (req, res) => {
    await projectEpicsHandler.delete(+req.query.projectEpicId);
    res.status(StatusCodes.OK).json('Пользователь удален');
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
projectRouter.use('/:projectId/retro', retroRouter);
projectRouter.use('/:projectId/daily', dailyRouter);
projectRouter.use('/:projectId/task', taskRouter);

export default projectRouter;
