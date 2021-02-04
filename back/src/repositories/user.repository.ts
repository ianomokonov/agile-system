import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Project } from '../models/project';
import { User } from '../models/user';
import { UserInfo } from '../models/user-info';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';
import projectRepository from './project.repository';

const sql = require('sql-query-generator');
sql.use('mysql');

class UserRepository {
    public async getUsers() {
        const [result] = await dbConnection.query('SELECT * FROM `user`');
        return result;
    }

    public async getUserByEmail(email: string) {
        const query = sql.select('user', "*").where({ email: email });
        const [result] = await dbConnection.query<RowDataPacket[]>(
            getQueryText(query.text),
            query.values
        );
        return (result[0] as unknown) as User;
    }

    public async getUserById(userId: number) {
        const query = sql.select('user', ['name', 'surname', 'email', 'vk', 'github']).where({ id: userId });
        const [[user]] = await dbConnection.query<RowDataPacket[]>(
            getQueryText(query.text),
            query.values
        );
        if (!user) {
            return null;
        }
        user.projects = await projectRepository.getUserProjects(userId);

        return (user as unknown) as UserInfo;
    }

    public async isTokenActual(token: string) {
        const [result] = await dbConnection.query<[]>(
            `SELECT * FROM refreshtokens WHERE token='${token}'`,
        );
        return !!result?.length;
    }

    public async addUser(user: User) {
        const query = sql.insert('user', user);
        const result = await dbConnection.query(
            getQueryText(query.text),
            query.values,
        );
        return (result[0] as ResultSetHeader).insertId;
    }

    public async editUser(userId: number, user: UserInfo) {
        const query = sql.update('user', user).where({ id: userId });
        await dbConnection.query(
            getQueryText(query.text),
            query.values,
        );
    }

    public async addToken(token: string) {
        await dbConnection.query('INSERT INTO refreshtokens (token) VALUES (?);', [token]);
    }

    public async deleteToken(token: string) {
        await dbConnection.query('DELETE FROM refreshtokens WHERE token=?;', [token]);
    }
}

export default new UserRepository();
