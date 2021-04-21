import { UserInfo } from '../../models/user-info';
import userService from '../../services/user-service';
import { removeFile } from '../../utils';

export default async (userId: number, user: UserInfo, hasFile: boolean) => {
  if (hasFile || !user.image) {
    const curUser = await userService.getUserById(userId, false);
    if (curUser.image) {
      removeFile(curUser.image);
    }
  }
  await userService.edit(userId, user);
};
