"use strict"

const express = require("express");

const articlesRoutes = require("./controllers/project");
const userRouter = require("./controllers/user");
const logger = require("../logger");

const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json())
app.use("/project", articlesRoutes);
app.use("/user", userRouter);

app
  .listen(DEFAULT_PORT, () => {
    logger.success(`Приложение запущено на http://localhost:${DEFAULT_PORT}`);
  })
  .on(`error`, (err) => {
    logger.error(`Не удалось запустить приложение. Ошибка: ${err}`);
  });
