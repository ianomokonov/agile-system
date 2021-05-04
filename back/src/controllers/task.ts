import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import tasksHandler from '../handlers/task/tasks.handler';
import updateTaskStatusHandler from '../handlers/task/update-task-status.handler';
import logger from '../logger';
import authJWT from '../middleware/authJWT';
import checkProjectPermissions from '../middleware/check-project-permissions';
import { Permissions } from '../models/permissions';
import { getFileExtension } from '../utils';

const taskRouter = Router({ mergeParams: true });
const storageConfig = multer.diskStorage({
  destination: 'src/files/taskfiles/',
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}-${Date.now()}${getFileExtension(file.originalname)}`);
  },
});

taskRouter.get(
  `/search`,
  authJWT,
  checkProjectPermissions(Permissions.CanReadProject),
  async (req, res) => {
    try {
      const result = await tasksHandler.search(
        req.query.searchString.toString(),
        res.locals.projectId,
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

taskRouter.get(
  `/:id/history`,
  authJWT,
  checkProjectPermissions(Permissions.CanReadProject),
  async (req, res) => {
    try {
      const result = await tasksHandler.getHistory(+req.params.id);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

taskRouter.delete(
  `/:id/remove-file/:fileId`,
  authJWT,
  checkProjectPermissions(Permissions.CanEditTask),
  async (req, res) => {
    try {
      await tasksHandler.removeFile(+req.params.fileId);
      res.status(StatusCodes.OK).json('Файл удален');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

taskRouter.get(
  `/:id/download-file/:fileId`,
  authJWT,
  checkProjectPermissions(Permissions.CanReadProject),
  async (req, res) => {
    try {
      const url = await tasksHandler.getFileUrl(+req.params.fileId);
      res.download(url);
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);
taskRouter.get(
  `/:id`,
  authJWT,
  checkProjectPermissions(Permissions.CanReadProject),
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
  checkProjectPermissions(Permissions.CanEditTask),
  async (req, res) => {
    try {
      await tasksHandler.update({ id: +req.params.id, ...req.body }, res.locals.userId);
      res.status(StatusCodes.OK).json('Задача обновлена');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

taskRouter.post(
  `/:id/upload-files`,
  authJWT,
  checkProjectPermissions(Permissions.CanEditTask),
  multer({ storage: storageConfig }).array('files'),
  async (req, res) => {
    try {
      const files = (req.files as Express.Multer.File[]).map((file) => {
        return {
          name: file.originalname,
          url: `${req.protocol}://${req.get('host')}/${file.path
            .replace(/\\/g, '/')
            .replace('src/files/', '')}`,
        };
      });
      await tasksHandler.uploadFiles(+req.params.id, files);
      res.status(StatusCodes.OK).json('Файлы добавлены');
    } catch (error) {
      res.status(error.statusCode || 500).json(error.error);
    }
  },
);

taskRouter.delete(
  `/:id/remove`,
  authJWT,
  checkProjectPermissions(Permissions.CanCreateTask),
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
  checkProjectPermissions(Permissions.CanEditTaskStatus),
  async (req, res) => {
    try {
      await updateTaskStatusHandler(+req.params.id, req.body.statusId, res.locals.userId);
      res.status(StatusCodes.OK).json('Статус задачи обновлен');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

export default taskRouter;
