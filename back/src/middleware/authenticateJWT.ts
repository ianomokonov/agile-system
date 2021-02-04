import { StatusCodes } from 'http-status-codes';
import userService from '../services/user-service';

export default async (req, res, next) => {
  const { email, password } = req.body;
  const existsUser = await userService.findByEmail(email);
  if (!existsUser) {
    res.status(StatusCodes.FORBIDDEN).json({ message: `Пользователь не найден` });
    return;
  }

  if (!(await userService.checkUser(existsUser, password))) {
    res.status(StatusCodes.FORBIDDEN).json({ message: `Неправильный пароль` });

    return;
  }

  res.locals.user = existsUser;
  next();
};
