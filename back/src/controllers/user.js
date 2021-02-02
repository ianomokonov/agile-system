`use strict`;

const { Router } = require(`express`);
const authJWT = require('../middleware/authJWT');
const authenticate = require(`../middleware/authenticateJWT`);
const storeService = require(`../services/store-service.js`);
const refreshTokenService = require(`../services/refresh-token-service`);
const { makeTokens } = require('../utils');
const refreshJWT = require('../middleware/refreshJWT');
const { StatusCodes } = require(`http-status-codes`);
const userRouter = new Router();

userRouter.get(`/profile`, authJWT, (req, res) => res.send(`user profile`));
userRouter.post(`/sign-up`, (req, res) => res.send(`user signed up`));
userRouter.post(`/login`, authenticate(storeService), async (req, res) => {
  const { id } = res.locals.user;
  const { accessToken, refreshToken } = makeTokens({ id });

  await refreshTokenService.add(refreshToken);
  res.json({ accessToken, refreshToken });
});
userRouter.post(`/refresh`, refreshJWT);
userRouter.delete(`/logout`, authJWT, (req, res) => {
  const {token} = req.body;
  refreshTokenService.drop(token);
  res.sendStatus(StatusCodes.NO_CONTENT);
})

module.exports = userRouter;
