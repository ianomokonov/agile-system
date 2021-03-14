import { CreateUserRequest } from '../../models/requests/create-user.request';
import userService from '../../services/user-service';
import loginHandler from './login.handler';

export default async (user: CreateUserRequest) => {
  const userId = await userService.add(user);
  return loginHandler(userId);
};
