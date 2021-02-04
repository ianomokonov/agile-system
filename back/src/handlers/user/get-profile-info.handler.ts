import userService from '../../services/user-service';

export default (userId) => {
  return userService.getUserById(userId);
};
