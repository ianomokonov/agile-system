import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { UserInfo } from '../models/user-info';
import userRepository from '../repositories/user.repository';

const saltRounds = 10;

class UserService {
  public async add(user: User) {
    const hash = await bcrypt.hash(user.password, saltRounds);
    return userRepository.addUser({ ...user, password: hash });
  }

  public async edit(userId: number, user: UserInfo) {
    return userRepository.editUser(userId, user);
  }

  public async findByEmail(email) {
    return userRepository.getUserByEmail(email);
  }

  public async getUserById(userId: number) {
    return userRepository.getUserById(userId);
  }

  public async checkUser(user: User, password: string) {
    const match = await bcrypt.compare(password, user.password);
    return match;
  }
}

export default new UserService();
