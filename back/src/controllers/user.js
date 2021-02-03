`use strict`;

const { Router } = require(`express`);
const authJWT = require('../middleware/authJWT');
const refreshJWT = require('../middleware/refreshJWT');
const { StatusCodes } = require(`http-status-codes`);
const loginHandler = require('../handlers/user/login.handler');
const logOutHandler = require('../handlers/user/log-out.handler');
const authenticateJWT = require('../middleware/authenticateJWT');
const userRouter = new Router();

userRouter.get(`/profile`, authJWT, (req, res) => res.send(`user profile`));
userRouter.post(`/sign-up`, (req, res) => res.send(`user signed up`));
userRouter.post(`/login`, authenticateJWT, async (req, res) => {
  const { id } = res.locals.user;
  const result = await loginHandler(id);
  res.json(result);
});
userRouter.post(`/refresh`, refreshJWT);
userRouter.delete(`/logout`, authJWT, async (req, res) => {
  const { token } = req.body;
  await logOutHandler(token);
  res.sendStatus(StatusCodes.NO_CONTENT);
})

module.exports = userRouter;
