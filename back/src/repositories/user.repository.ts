import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { CreateUserRequest } from '../models/requests/create-user.request';
import { CheckUserResponse } from '../models/responses/check-user.response';
import { UserShortView } from '../models/responses/user-short-view';
import { GetProfileInfoResponse } from '../models/responses/get-profile-info.response';
import { UserInfo } from '../models/user-info';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';
import projectRepository from './project.repository';

sql.use('mysql');

class UserRepository {
  public async getUserByEmail(email: string): Promise<CheckUserResponse> {
    const query = sql.select('user', ['id', 'password']).where({ email });
    const [result] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return result[0] as CheckUserResponse;
  }

  public async getUserById(userId: number, withProjects = true): Promise<GetProfileInfoResponse> {
    const query = sql
      .select('user', ['name', 'surname', 'email', 'vk', 'github', 'image'])
      .where({ id: userId });
    const [[user]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    if (!user) {
      return null;
    }
    if (withProjects) {
      user.projects = await projectRepository.getUserProjects(userId);
    }

    return (user as unknown) as GetProfileInfoResponse;
  }

  public async getUsers(userId: number, searchString?: string): Promise<UserShortView[]> {
    const query = sql
      .select('user', ['id', 'name', 'surname', 'email', 'image'])
      .where({ email: `${searchString}%` }, 'LIKE')
      .and({ id: userId }, '!=')
      .limit(20, 0);
    const [users] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return users as UserShortView[];
  }

  public async isTokenActual(token: string) {
    const [result] = await dbConnection.query<[]>(
      `SELECT * FROM refreshtokens WHERE token='${token}'`,
    );
    return !!result?.length;
  }

  public async addUser(user: CreateUserRequest): Promise<number> {
    const query = sql.insert('user', user);
    const result = await dbConnection.query(getQueryText(query.text), query.values);
    return (result[0] as ResultSetHeader).insertId;
  }

  public async editUser(userId: number, user: UserInfo) {
    const query = sql
      .update('user', {
        name: user.name,
        surname: user.surname,
        vk: user.vk,
        gitHub: user.gitHub,
        image: user.image,
      })
      .where({ id: userId });
    await dbConnection.query(getQueryText(query.text), query.values);
  }

  public async updatePassword(userId: number, password) {
    const query = sql
      .update('user', {
        password,
      })
      .where({ id: userId });
    await dbConnection.query(getQueryText(query.text), query.values);
  }

  public async addToken(token: string) {
    await dbConnection.query('INSERT INTO refreshtokens (token) VALUES (?);', [token]);
  }

  public async deleteToken(token: string) {
    await dbConnection.query('DELETE FROM refreshtokens WHERE token=?;', [token]);
  }
}

export default new UserRepository();
