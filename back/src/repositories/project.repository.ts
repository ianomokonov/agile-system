import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Link } from '../models/link';
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
    const query = sql.insert('project', {
      name: project.name,
      description: project.description,
      ownerId: project.ownerId,
      repository: project.repository,
    });
    const result = await dbConnection.query(getQueryText(query.text), query.values);
    return (result[0] as ResultSetHeader).insertId;
  }

  public async createProjectRoles(projectId: number, roles: string[]) {
    if (!roles?.length) {
      return [];
    }

    const query = `${`INSERT INTO projectroles (projectId, name) VALUES ${roles
      .map(() => `(${projectId}, ?), `)
      .join('')}`.replace(/,\s$/, '')};`;

    await dbConnection.query(query, roles);

    return this.getProjectRoles(projectId);
  }

  public async createProjectUsers(projectId: number, userIds: number[]): Promise<RowDataPacket[]> {
    if (!userIds?.length) {
      return [];
    }

    const query = `${`INSERT INTO projectuser (projectId, userId) VALUES ${userIds
      .map(() => `(${projectId}, ?), `)
      .join('')}`.replace(/,\s$/, '')};`;
    await dbConnection.query(query, userIds);
    return this.getProjectUsers(projectId);
  }

  public async getProjectRoles(projectId: number) {
    const [roles] = await dbConnection.query<RowDataPacket[]>(
      `SELECT * FROM projectroles WHERE projectId='${projectId}'`,
    );

    return roles;
  }

  public async getProjectUsers(projectId: number) {
    const [users] = await dbConnection.query<RowDataPacket[]>(
      `SELECT * FROM projectuser WHERE projectId='${projectId}'`,
    );

    return users;
  }

  public async createProjectLinks(projectId: number, links: Link[]) {
    if (!links?.length) {
      return;
    }

    const query = `INSERT INTO projectlinks (projectId, name, url) VALUES ${links
      .map((link) => `(${projectId}, '${link.name}', '${link.url}'), `)
      .join('')}`.replace(/,\s$/, '');

    await dbConnection.query(query);
  }

  public async createProjectUserRoles(roles: { projectUserId: number; projectRoleId: number }[]) {
    if (!roles?.length) {
      return;
    }

    const query = `INSERT INTO projectuserrole (projectUserId, projectRoleId) VALUES ${roles
      .map((role) => `('${role.projectUserId}', '${role.projectRoleId}'), `)
      .join('')}`.replace(/,\s$/, '');

    await dbConnection.query(query);
  }

  public async getUserProject(userId: number, projectId: number) {
    if (!userId || !projectId) {
      return null;
    }

    const query = `SELECT * FROM project p WHERE p.Id=${projectId} AND p.ownerId=${userId} OR 0 < (SELECT COUNT(*) from projectuser pu where pu.userId=${userId} AND pu.projectId=p.id)`;

    const [projects] = await dbConnection.query(query);

    return projects[0];
  }
}

export default new ProjectRepository();
