import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { StatusCodes } from 'http-status-codes';
import { AddProjectUserRequest } from '../models/requests/add-project-user-request';
import { CreateProjectRequest } from '../models/requests/create-project-request';
import { EditProjectUserRequest } from '../models/requests/edit-project-user-request';
import {
  CreateProjectRoleRequest,
  UpdateProjectRoleRequest,
} from '../models/requests/project-role.models';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';
import { UserShortView } from '../models/responses/user-short-view';
import { ProjectRoleResponse } from '../models/responses/project-role.response';
import { ProjectResponse } from '../models/responses/project.response';
import { StatusResponse } from '../models/responses/status.response';
import { TaskShortView } from '../models/responses/task-short-view';
import { ProjectShortView } from '../models/responses/project-short-view';
import { Sprint } from '../models/sprint';
import { CreateSprintRequest } from '../models/requests/create-sprint.request';
import { IdNameResponse } from '../models/responses/id-name.response';
// eslint-disable-next-line import/no-cycle
import demoRepository from './demo.repository';
import retroRepository from './retro.repository';
import { WebError } from '../models/error';
// eslint-disable-next-line import/no-cycle
import planningRepository from './planning.repository';
import { Permissions } from '../models/permissions';

sql.use('mysql');

class ProjectRepository {
  public async getUserProjects(userId: number) {
    const query = sql
      .select('project', ['project.id', 'project.name', 'project.lastEditDate'])
      .join('projectUser', { projectId: 'project.id' }, 'RIGHT OUTER')
      .where({ ownerId: userId })
      .or({ 'projectUser.userId': userId })
      .groupby('project.id');

    const [projects] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return projects as ProjectShortView[];
  }

  public async create(userId: number, project: CreateProjectRequest) {
    const query = sql.insert('project', {
      name: project.name,
      description: project.description,
      ownerId: userId,
    });
    const result = await dbConnection.query(getQueryText(query.text), query.values);
    return (result[0] as ResultSetHeader).insertId;
  }

  public async addProjectUser(request: AddProjectUserRequest) {
    const query = sql.insert('projectuser', {
      projectId: request.projectId,
      userId: request.userId,
    });
    try {
      const result = await dbConnection.query(getQueryText(query.text), query.values);
      const projectUserId = (result[0] as ResultSetHeader).insertId;

      await this.addProjectUserRoles(projectUserId, request.roleIds);
      return projectUserId;
    } catch (e) {
      throw new WebError(
        StatusCodes.CONFLICT,
        'Пользователь уже в проекте или является создателем проекта',
      );
    }
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

  public async getFullProjectUsers(projectId: number, userId: number, all = false) {
    let query = sql
      .select('projectuser', [
        'projectuser.id',
        'user.name',
        'user.surname',
        'user.image',
        'user.email',
        `(user.id = ${userId}) as isMy`,
        `(user.id = project.ownerId) as isOwner`,
      ])
      .join('user', { 'projectuser.userId': 'user.id' })
      .join('project', { 'projectuser.projectId': 'project.id' })
      .where({ projectId });

    if (!all) {
      query = query.and({ 'user.id': userId }, '!=').and({ 'user.id': 'project.ownerId' }, '!=');
    }

    let [users] = await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);

    users = await Promise.all(
      users.map(async (userTemp) => {
        const user = userTemp;
        user.roleIds = await this.getProjectUserRoleIds(user.id);
        return user;
      }),
    );
    return users as UserShortView[];
  }

  public async getProjectSprints(projectId: number) {
    const query = sql
      .select('projectsprint', [
        'projectsprint.id',
        'projectsprint.startDate',
        'projectsprint.endDate',
        'projectsprint.name',
        'projectsprint.goal',
        'projectsprint.isActive',
        'projectsprint.isFinished',
        'projectsprint.projectId',
        'projectplanning.id as planningId',
      ])
      .join('projectplanning', { 'projectsprint.id': 'sprintId' }, 'LEFT')
      .where({ 'projectsprint.projectId': projectId, 'projectsprint.isFinished': false })
      .orderby(['isFinished', 'isActive DESC', 'projectsprint.createDate DESC']);

    let [sprints] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    if (!sprints?.length) {
      return [];
    }

    sprints = await Promise.all(
      sprints.map(async (sprintTemp) => {
        const sprint = sprintTemp;
        sprint.retro = await retroRepository.getByProjectSprintId(sprint.id);
        sprint.demo = await demoRepository.getByProjectSprintId(sprint.id);
        sprint.tasks = await this.getSprintTasks(projectId, sprint.id);
        return sprint;
      }),
    );
    return sprints as Sprint[];
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

  public async editProject(projectId, request: CreateProjectRequest) {
    const query = sql
      .update('project', {
        name: request.name,
        description: request.description,
      })
      .where({ id: projectId });
    dbConnection.query(getQueryText(query.text), query.values);
  }

  public async removeProjectRole(projectRoleId: number) {
    if (!projectRoleId) {
      console.error('Укажите id роли проекта');
      return;
    }

    const query = sql.deletes('projectroles').where({ id: projectRoleId });

    await dbConnection.query(getQueryText(query.text), query.values);
  }

  public async getProjectRoles(projectId: number) {
    let [roles] = await dbConnection.query<RowDataPacket[]>(
      `SELECT id, name FROM projectroles WHERE projectId='${projectId}'`,
    );
    roles = await Promise.all(
      roles.map(async (roleTemp) => {
        const role = roleTemp;
        role.permissionIds = await this.getRolePermissionIds(role.id);
        return role;
      }),
    );
    return roles as ProjectRoleResponse[];
  }

  public async getProjectUserPermissions(userId: number, projectId: number) {
    let query = sql.select('project', '*').where({ id: projectId, ownerId: userId });

    const [projects] = await dbConnection.query(getQueryText(query.text), query.values);
    if (projects[0]) {
      return Object.values(Permissions).filter(
        (v) => parseInt(v as string, 10) >= 0,
      ) as Permissions[];
    }

    query = sql
      .select('user', ['projectrolepermission.permissionId'])
      .join('projectuser', { 'user.id': 'projectuser.userId' }, 'RIGHT')
      .join('projectuserrole', { 'projectuserrole.projectUserId': 'projectuser.id' }, 'RIGHT')
      .join(
        'projectrolepermission',
        {
          'projectuserrole.projectRoleId': 'projectrolepermission.projectRoleId',
        },
        'RIGHT',
      )
      .where({ 'user.id': userId, 'projectuser.projectId': projectId });

    const [permissions] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return permissions.map((p) => p.permitionId) as Permissions[];
  }

  public async getRolePermissionIds(roleId: number) {
    const [permissions] = await dbConnection.query<RowDataPacket[]>(
      `SELECT permissionId FROM projectrolepermission WHERE projectRoleId='${roleId}'`,
    );

    return permissions.map((p) => p.permissionId) as number[];
  }

  public async getProjectUserRoleIds(userId: number) {
    const [roles] = await dbConnection.query<RowDataPacket[]>(
      `SELECT projectRoleId FROM projectuserrole WHERE projectUserId='${userId}'`,
    );

    return roles.map((p) => p.projectRoleId) as number[];
  }

  public async getProjectUsers(projectId: number) {
    const [users] = await dbConnection.query<RowDataPacket[]>(
      `SELECT u.id, u.name, u.email, u.surname, u.image FROM projectuser pu JOIN user u ON pu.userId = u.id WHERE projectId='${projectId}'`,
    );

    return users as UserShortView[];
  }

  public async getProjectUser(userId: number) {
    const [[user]] = await dbConnection.query<
      RowDataPacket[]
    >(`SELECT pu.id, u.name, u.surname, u.image, u.email 
    FROM projectuser pu JOIN user u ON pu.userId = u.id 
    WHERE pu.id=${userId}`);

    return user;
  }

  public async getProjectUserByUserId(userId: number, projectId: number) {
    const [[user]] = await dbConnection.query<
      RowDataPacket[]
    >(`SELECT pu.id, u.name, u.surname, u.image, u.email 
    FROM projectuser pu JOIN user u ON pu.userId = u.id 
    WHERE u.id=${userId} AND pu.projectId=${projectId}`);

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

    const values = [];

    const query = `INSERT INTO projectuserrole (projectRoleId, projectUserId) VALUES ${roleIds
      .map((id) => {
        values.push(id, projectUserId);
        return `(?, ?), `;
      })
      .join('')}`.replace(/,\s$/, '');

    await dbConnection.query(query, values);
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
    const values = [];
    const query = `INSERT INTO projectrolepermission (projectRoleId, permissionId) VALUES ${permissionIds
      .map((id) => {
        values.push(projectRoleId, id);
        return `(?, ?), `;
      })
      .join('')}`.replace(/,\s$/, '');

    await dbConnection.query(query, values);
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

  public async getProject(projectId: number): Promise<ProjectResponse> {
    if (!projectId) {
      console.error('Укажите id проекта');
      return null;
    }

    const query = sql.select('project', ['id', 'name', 'description']).where({ id: projectId });

    const [[project]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return project as ProjectResponse;
  }

  public async getProjectActiveSprint(projectId: number) {
    if (!projectId) {
      console.error('Укажите id проекта');
      return null;
    }

    const query = sql.select('projectsprint', '*').where({ projectId, isActive: true }).limit(1, 0);

    const [[sprint]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    if (!sprint) {
      return null;
    }
    sprint.tasks = await this.getSprintTasks(projectId, sprint?.id);

    return sprint as Sprint;
  }

  public async getSprintTasks(projectId?: number, projectSprintId?: number) {
    let query = sql.select('projecttask', [
      'id',
      'name',
      'statusId',
      'typeId',
      'priorityId',
      'createDate',
      'projectUserId',
      'points',
    ]);

    if (projectSprintId) {
      query = query.where({ projectSprintId });
    } else {
      query = query.where({ projectSprintId: null }, 'IS').and({ projectId });
    }

    let [tasks] = await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
    tasks = await Promise.all(
      tasks.map(async (taskTemp) => {
        const task = taskTemp;
        task.projectUser = await this.getProjectUser(task.projectUserId);
        return task;
      }),
    );
    return tasks as TaskShortView[];
  }

  public async getProjectStatuses() {
    const query = sql.select('projecttaskstatus', '*').orderby('id');

    const [statuses] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return statuses as StatusResponse[];
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
      WHERE p.permissionId = '${permission}' AND u.id = ${userId} AND pu.projectId = ${projectId}`;

    const [users] = await dbConnection.query(query);

    return !!users[0];
  }

  public async createSprint(request: CreateSprintRequest, projectId: number) {
    const query = sql.insert('projectsprint', {
      projectId,
      name: request.name,
      goal: request.goal,
    });
    const result = await dbConnection.query(getQueryText(query.text), query.values);
    const sprintId = (result[0] as ResultSetHeader).insertId;
    return sprintId;
  }

  public async getProjectSprintNames(projectId?: number, sprintId?: number) {
    const query = sql.select('projectsprint', ['id', 'name']);
    if (sprintId) {
      query.where({ isFinished: false, id: sprintId });
    } else {
      query.where({ projectId, isFinished: false });
    }

    const [sprints] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return sprints as IdNameResponse[];
  }

  public async startSprint(sprintId: number, projectId: number, userId: number) {
    let query = sql.select('projectsprint', ['id']).where({ isActive: true, projectId });
    const [[sprint]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    await planningRepository.start(projectId, null, sprintId);

    query = sql
      .update('projectsprint', {
        endDate: new Date(),
        isActive: false,
        isFinished: true,
      })
      .where({ isActive: true, projectId });
    await dbConnection.query(getQueryText(query.text), query.values);

    query = sql
      .update('projectsprint', {
        startDate: new Date(),
        isActive: true,
        isFinished: false,
      })
      .where({ id: sprintId });
    await dbConnection.query(getQueryText(query.text), query.values);

    if (sprint) {
      query = sql
        .update('projectTask', { projectSprintId: sprintId, lastEditUserId: userId })
        .where({ projectSprintId: sprint.id })
        .and({ statusId: 4 }, '!=');
      await dbConnection.query(getQueryText(query.text), query.values);
    }
  }

  public async finishSprint(sprintId: number) {
    const query = sql
      .update('projectsprint', {
        endDate: new Date(),
        isActive: false,
        isFinished: true,
      })
      .where({ id: sprintId });
    await dbConnection.query(getQueryText(query.text), query.values);
  }
}

export default new ProjectRepository();
