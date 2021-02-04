import { UserInfo } from '../../models/user-info';
import userService from '../../services/user-service';

export default async (userId: number, user: UserInfo) => {
    delete user.email;
    delete user['password'];
    await userService.edit(userId, user);
};
