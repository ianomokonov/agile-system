import bcrypt from 'bcrypt';
import { CreateUserRequest } from '../models/requests/create-user.request';
import { UserInfo } from '../models/user-info';
import userRepository from '../repositories/user.repository';

const saltRounds = 10;

class UserService {
  public async add(user: CreateUserRequest) {
    const hash = await bcrypt.hash(user.password, saltRounds);
    return userRepository.addUser({ ...user, password: hash });
  }

  public async edit(userId: number, user: UserInfo) {
    return userRepository.editUser(userId, user);
  }

  public async findByEmail(email) {
    return userRepository.getUserByEmail(email);
  }

  public async getUserById(userId: number, withProjects?) {
    return userRepository.getUserById(userId, withProjects);
  }

  public async getUsers(userId, searchString?: string) {
    return userRepository.getUsers(userId, searchString);
  }

  public async checkUser(userPassword: string, password: string) {
    const match = await bcrypt.compare(password, userPassword);
    return match;
  }
}

export default new UserService();
