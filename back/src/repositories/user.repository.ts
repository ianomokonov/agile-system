import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { User } from '../models/user';
import dbConnection from './db-connection';

class UserRepository {
  public async getUsers() {
    const [result] = await dbConnection.query('SELECT * FROM `user`');
    return result;
  }

  public async getUserByEmail(email: string) {
    const [result] = await dbConnection.query<RowDataPacket[]>(
      `SELECT * FROM user WHERE email='${email}'`,
    );
    return (result[0] as unknown) as User;
  }

  public async isTokenActual(token: string) {
    const [result] = await dbConnection.query<[]>(
      `SELECT * FROM refreshtokens WHERE token='${token}'`,
    );
    return !!result?.length;
  }

  public async addUser(user: User) {
    const result = await dbConnection.query(
      'INSERT INTO user (name, email, password, surname, vk, gitHub) VALUES (?,?,?,?,?,?);',
      [user.name, user.email, user.password, user.surname, user.vk, user.gitHub],
    );
    return (result[0] as ResultSetHeader).insertId;
  }

  public async addToken(token: string) {
    await dbConnection.query('INSERT INTO refreshtokens (token) VALUES (?);', [token]);
  }

  public async deleteToken(token: string) {
    await dbConnection.query('DELETE FROM refreshtokens WHERE token=?;', [token]);
  }
}

export default new UserRepository();
