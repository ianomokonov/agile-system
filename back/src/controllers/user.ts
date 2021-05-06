import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import authJWT from '../middleware/authJWT';
import refreshJWT from '../middleware/refreshJWT';
import loginHandler from '../handlers/user/login.handler';
import logOutHandler from '../handlers/user/log-out.handler';
import authenticateJWT from '../middleware/authenticateJWT';
import signUpHandler from '../handlers/user/sign-up.handler';
import getProfileInfoHandler from '../handlers/user/get-profile-info.handler';
import editProfileHandler from '../handlers/user/edit-profile.handler';
import verifyRefreshToken from '../middleware/verifyRefreshToken';
import getUsersHandler from '../handlers/user/get-users.handler';
import { getFileExtension } from '../utils';

const storageConfig = multer.diskStorage({
  destination: 'files/userimages/',
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}-${Date.now()}${getFileExtension(file.originalname)}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const userRouter = Router();
userRouter.get(`/profile`, authJWT, async (req, res) => {
  const { userId } = res.locals;

  const result = await getProfileInfoHandler(userId);
  res.json(result);
});
userRouter.get(`/users`, authJWT, async (req, res) => {
  const result = await getUsersHandler(req.query.searchString as string);
  res.json(result);
});
userRouter.put(
  `/profile`,
  authJWT,
  multer({ storage: storageConfig, fileFilter }).single('image'),
  async (req, res) => {
    const { userId } = res.locals;
    if (req.file) {
      await editProfileHandler(
        userId,
        {
          ...req.body,
          image: `${req.protocol}://${req.get('host')}/${req.file.path
            .replace(/\\/g, '/')
            .replace('files/', '')}`,
        },
        true,
      );
    } else {
      await editProfileHandler(userId, req.body, false);
    }

    res.status(StatusCodes.OK).json('Профиль изменен');
  },
);
userRouter.post(`/sign-up`, async (req, res) => {
  const result = await signUpHandler(req.body);
  res.json(result);
});
userRouter.post(`/login`, authenticateJWT, async (req, res) => {
  const { userId } = res.locals;
  const result = await loginHandler(userId);
  res.json(result);
});
userRouter.post(`/refresh`, refreshJWT);
userRouter.delete(`/logout`, verifyRefreshToken, async (req, res) => {
  const { token } = req.query;
  await logOutHandler(token);
  res.sendStatus(StatusCodes.NO_CONTENT);
});

export default userRouter;
