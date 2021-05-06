import userService from '../../services/user-service';
import { makeTokens } from '../../utils';

export default async (userId, password) => {
  await userService.updatePassword(userId, password);
  return makeTokens({ userId });
};
