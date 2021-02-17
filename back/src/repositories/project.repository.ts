import e from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { CreateProjectRequest } from '../models/create-project-request';
import { Link } from '../models/link';
import { Project } from '../models/project';
import { getQueryText, Permissions } from '../utils';
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

  public async create(userId: number, project: CreateProjectRequest) {
    const query = sql.insert('project', {
      name: project.name,
      description: project.description,
      ownerId: userId,
      repository: project.repository,
    });
    const result = await dbConnection.query(getQueryText(query.text), query.values);
    return (result[0] as ResultSetHeader).insertId;
  }

  public async createProjectUsers(projectId: number, userIds: number[]) {
    if (!userIds?.length) {
      return;
    }

    const query = `${`INSERT INTO projectuser (projectId, userId) VALUES ${userIds
      .map(() => `(${projectId}, ?), `)
      .join('')}`.replace(/,\s$/, '')};`;
    await dbConnection.query(query, userIds);
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

  public async getUserProject(userId: number, projectId: number) {
    if (!userId || !projectId) {
      return null;
    }

    const query = `SELECT * FROM project p WHERE p.Id=${projectId} AND p.ownerId=${userId} OR 0 < (SELECT COUNT(*) from projectuser pu where pu.userId=${userId} AND pu.projectId=p.id)`;

    const [projects] = await dbConnection.query(query);

    return projects[0];
  }

  public async checkUserPermission(userId: number, projectId: number, permission: Permissions) {
    if (!userId || !projectId || permission) {
      return false;
    }
    let query = `SELECT * FROM project p WHERE p.Id=${projectId} AND p.ownerId=${userId}`;
    const [projects] = await dbConnection.query(query);
    if (projects[0]) {
      return true;
    }

    query = `SELECT * FROM user u 
    JOIN projectuser pu ON u.id = pu.userId 
    JOIN projectuserrole pur ON pu.id = pur.projectUserId 
    JOIN projectrolepermission prp ON pur.projectRoleId = prp.projectRoleId
    JOIN permission p ON prp.permissionId = p.id
      WHERE p.name = '${permission}' AND u.id = ${userId}`;

    const [users] = await dbConnection.query(query);

    return !!users[0];
  }
}

export default new ProjectRepository();
