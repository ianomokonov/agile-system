import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import tasksHandler from '../handlers/task/tasks.handler';
import updateTaskStatusHandler from '../handlers/task/update-task-status.handler';
import logger from '../logger';
import authJWT from '../middleware/authJWT';
import checkTaskPermissions from '../middleware/check-task-permissions';
import { getFileExtension, Permissions } from '../utils';

const taskRouter = Router();
const storageConfig = multer.diskStorage({
  destination: 'src/files/taskfiles/',
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}-${Date.now()}${getFileExtension(file.originalname)}`);
  },
});

taskRouter.delete(
  `/:id/remove-file/:fileId`,
  authJWT,
  checkTaskPermissions(Permissions.CanEditProject),
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
  checkTaskPermissions(Permissions.CanReadProject),
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
  checkTaskPermissions(Permissions.CanEditProject),
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
      await updateTaskStatusHandler(+req.params.id, req.body.statusId, res.locals.userId);
      res.status(StatusCodes.OK).json('Статус задачи обновлен');
    } catch (error) {
      res.status(error.statusCode).json(error.error);
    }
  },
);

export default taskRouter;
