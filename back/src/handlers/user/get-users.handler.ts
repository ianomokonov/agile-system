import userService from '../../services/user-service';

export default (userId, searchString?: string) => {
  return userService.getUsers(userId, searchString);
};
