import userService from '../../services/user-service';

export default (searchString?: string) => {
  return userService.getUsers(searchString);
};
