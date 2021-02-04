import { User } from '../../models/user';
import userService from '../../services/user-service';
import loginHandler from './login.handler';

export default async (user: User) => {
  const userId = await userService.add(user);
  return loginHandler(userId);
};
