import { UserInfo } from '../../models/user-info';
import userService from '../../services/user-service';

export default async (userId: number, user: UserInfo) => {
  await userService.edit(userId, user);
};
