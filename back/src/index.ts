import projectRouter from './controllers/project';
import userRouter from './controllers/user';
import taskRouter from './controllers/task';
import logger from './logger';

const express = require('express');

const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);

app
  .listen(DEFAULT_PORT, () => {
    logger.success(`Приложение запущено на http://localhost:${DEFAULT_PORT}`);
  })
  .on(`error`, (err: any) => {
    logger.error(`Не удалось запустить приложение. Ошибка: ${err}`);
  });
