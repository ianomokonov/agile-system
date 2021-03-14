import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { AddProjectUserRequest } from '../models/requests/add-project-user-request';
import { CreateProjectRequest } from '../models/requests/create-project-request';
import { EditProjectUserRequest } from '../models/requests/edit-project-user-request';
import { Link } from '../models/link';
import { Project } from '../models/project';
import {
  CreateProjectRoleRequest,
  UpdateProjectRoleRequest,
} from '../models/requests/project-role.models';
import { getQueryText, Permissions } from '../utils';
import dbConnection from './db-connection';

sql.use('mysql');

class ProjectRepository {
  public async getUserProjects(userId: number) {
    const query = sql.select('project', '*').where({ ownerId: userId });
    const [projects] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
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

  public async addProjectUser(request: AddProjectUserRequest) {
    const query = sql.insert('projectuser', {
      projectId: request.projectId,
      userId: request.userId,
    });
    const result = await dbConnection.query(getQueryText(query.text), query.values);
    const projectUserId = (result[0] as ResultSetHeader).insertId;

    await this.addProjectUserRoles(projectUserId, request.roleIds);
    return projectUserId;
  }

  public async editProjectUser(request: EditProjectUserRequest) {
    await this.removeProjectUserRoles(request.projectUserId);
    this.addProjectUserRoles(request.projectUserId, request.roleIds);
  }

  public async removeProjectUser(projectUserId: number) {
    if (!projectUserId) {
      console.error('Укажите id пользователя проекта');
      return;
    }

    const query = sql.deletes('projectuser').where({ id: projectUserId });

    await dbConnection.query(getQueryText(query.text), query.values);
  }

  public async getFullProjectUsers(projectId: number) {
    const [users] = await dbConnection.query<
      RowDataPacket[]
    >(`SELECT pu.id, u.name, u.surname, u.image, u.email 
        FROM projectuser pu JOIN user u ON pu.userId = u.id 
        WHERE pu.projectId=${projectId}`);
    return users;
  }

  public async addProjectRole(request: CreateProjectRoleRequest) {
    const query = sql.insert('projectroles', {
      projectId: request.projectId,
      name: request.roleName,
    });
    const result = await dbConnection.query(getQueryText(query.text), query.values);
    const projectRoleId = (result[0] as ResultSetHeader).insertId;

    await this.addProjectRolePermissions(projectRoleId, request.permissionIds);
    return projectRoleId;
  }

  public async editProjectRole(request: UpdateProjectRoleRequest) {
    const query = sql
      .update('projectroles', { name: request.projectRoleName })
      .where({ id: request.projectRoleId });
    dbConnection.query(getQueryText(query.text), query.values);
    await this.removeProjectRolePermissions(request.projectRoleId);
    this.addProjectRolePermissions(request.projectRoleId, request.permissionIds);
  }

  public async removeProjectRole(projectRoleId: number) {
    if (!projectRoleId) {
      console.error('Укажите id роли проекта');
      return;
    }

    const query = sql.deletes('projectroles').where({ id: projectRoleId });

    await dbConnection.query(getQueryText(query.text), query.values);
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

  public async getProjectPermissions() {
    const [permissions] = await dbConnection.query<RowDataPacket[]>(`SELECT * FROM permission`);

    return permissions;
  }

  public async getProjectUsers(projectId: number) {
    const [users] = await dbConnection.query<RowDataPacket[]>(
      `SELECT * FROM projectuser WHERE projectId='${projectId}'`,
    );

    return users;
  }

  public async getProjectUser(projectId: number, userId: number) {
    const query = sql.select('projectuser', '*').where({ projectId, id: userId });

    const [[user]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return user;
  }

  private async addProjectUserRoles(projectUserId: number, roleIds: number[]) {
    if (!projectUserId) {
      console.error('Укажите id пользователя проекта');
      return;
    }
    if (!roleIds?.length) {
      console.error('Список ролей не может быть пустым');
      return;
    }

    const query = `INSERT INTO projectuserrole (projectRoleId, projectUserId) VALUES ${roleIds
      .map((id) => `(${id}, '${projectUserId}'), `)
      .join('')}`.replace(/,\s$/, '');

    await dbConnection.query(query);
  }

  private async addProjectRolePermissions(projectRoleId: number, permissionIds: number[]) {
    if (!projectRoleId) {
      console.error('Укажите id роли проекта');
      return;
    }
    if (!permissionIds?.length) {
      console.error('Список разрешений не может быть пустым');
      return;
    }

    const query = `INSERT INTO projectrolepermission (projectRoleId, permissionId) VALUES ${permissionIds
      .map((id) => `(${projectRoleId}, '${id}'), `)
      .join('')}`.replace(/,\s$/, '');

    await dbConnection.query(query);
  }

  private async removeProjectUserRoles(projectUserId: number) {
    if (!projectUserId) {
      console.error('Укажите id пользователя проекта');
      return;
    }

    const query = sql.deletes('projectuserrole').where({ projectUserId });

    await dbConnection.query(getQueryText(query.text), query.values);
  }

  private async removeProjectRolePermissions(projectRoleId: number) {
    if (!projectRoleId) {
      console.error('Укажите id роли проекта');
      return;
    }

    const query = sql.deletes('projectrolepermission').where({ projectRoleId });

    await dbConnection.query(getQueryText(query.text), query.values);
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

  public async getProject(projectId: number) {
    if (!projectId) {
      console.error('Укажите id проекта');
      return null;
    }

    const query = sql.select('project', '*').where({ id: projectId });

    const [[project]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return project;
  }

  public async getProjectTasks(projectId: number) {
    if (!projectId) {
      console.error('Укажите id проекта');
      return null;
    }

    const query = sql.select('projecttask', '*').where({ projectId });

    const [tasks] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return tasks;
  }

  public async checkUserPermission(userId: number, projectId: number, permission: Permissions) {
    if (!userId || !projectId || !permission) {
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
