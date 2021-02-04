import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import authJWT from '../middleware/authJWT';
import refreshJWT from '../middleware/refreshJWT';
import loginHandler from '../handlers/user/login.handler';
import logOutHandler from '../handlers/user/log-out.handler';
import authenticateJWT from '../middleware/authenticateJWT';
import signUpHandler from '../handlers/user/sign-up.handler';
import getProfileInfoHandler from '../handlers/user/get-profile-info.handler';

const userRouter = Router();
userRouter.get(`/profile`, authJWT, async (req, res) => {
  const { userId } = res.locals.user;

  const result = await getProfileInfoHandler(userId);
  res.json(result);
});
userRouter.post(`/sign-up`, async (req, res) => {
  const result = await signUpHandler(req.body);
  res.json(result);
});
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
});

export default userRouter;
