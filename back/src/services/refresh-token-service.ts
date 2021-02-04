import userRepository from '../repositories/user.repository';

class RefreshTokenService {
  public async add(token) {
    await userRepository.addToken(token);
  }

  public async find(token) {
    return userRepository.isTokenActual(token);
  }

  public async drop(token) {
    await userRepository.deleteToken(token);
  }
}

export default new RefreshTokenService();
