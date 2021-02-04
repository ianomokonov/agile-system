import { RowDataPacket } from 'mysql2';
import { Project } from '../models/project';
import dbConnection from './db-connection';

class ProjectRepository {
  public async getUserProjects(userId: number) {
    const [projects] = await dbConnection.query<RowDataPacket[]>(
      `SELECT * FROM project WHERE ownerId='${userId}'`,
    );

    return (projects as unknown) as Project[];
  }
}

export default new ProjectRepository();
