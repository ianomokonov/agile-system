import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Project } from '../models/project';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';

const sql = require('sql-query-generator');
sql.use('mysql');

class ProjectRepository {
  public async getUserProjects(userId: number) {
    const [projects] = await dbConnection.query<RowDataPacket[]>(
      `SELECT * FROM project WHERE ownerId='${userId}'`,
    );

    return (projects as unknown) as Project[];
  }

  public async create(project: Project) {
    const query = sql.insert('project', { name: project.name, description: project.description, ownerId: project.ownerId, repository: project.repository });
    const result = await dbConnection.query(
      getQueryText(query.text),
      query.values
    );
    return (result[0] as ResultSetHeader).insertId;
  }
}

export default new ProjectRepository();
