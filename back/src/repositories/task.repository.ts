import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import logger from '../logger';
import { CRUD } from '../models/crud.interface';
import { CreateTaskRequest, UpdateTaskRequest } from '../models/requests/task.models';
import { StatusResponse } from '../models/responses/status.response';
import { TaskShortView } from '../models/responses/task-short-view';
import { TaskResponse } from '../models/responses/task.response';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';
import projectRepository from './project.repository';

sql.use('mysql');

class TaskRepository implements CRUD<CreateTaskRequest, UpdateTaskRequest> {
  public async getProjectId(taskId: number) {
    const query = sql.select('projecttask', 'projectId').where({ id: taskId });

    const [[project]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return project?.projectId;
  }

  private async getStatus(statusId: number) {
    const query = sql.select('projecttaskstatus', '*').where({ id: statusId });

    const [[status]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return status as StatusResponse;
  }

  public async read(taskId: number) {
    const [[task]] = await dbConnection.query<RowDataPacket[]>(`SELECT *
        FROM projecttask 
        WHERE id=${taskId}`);
    const [status, user, creator, sprints] = await Promise.all([
      await this.getStatus(task.statusId),
      projectRepository.getProjectUser(task.projectUserId),
      projectRepository.getProjectUser(task.creatorId),
      projectRepository.getProjectSprintNames(task.projectId, task.projectSprintId),
    ]);

    task.status = status;
    task.projectUser = user;
    task.creator = creator;
    task.sprint = task.projectSprintId ? sprints[0] : null;
    return task as TaskResponse;
  }

  public async getShortTaskView(taskId: number) {
    const query = sql
      .select('projecttask', [
        'id',
        'name',
        'statusId',
        'typeId',
        'priorityId',
        'createDate',
        'projectUserId',
        'points',
      ])
      .where({ id: taskId });
    const [[task]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return task as TaskShortView;
  }

  public async getNewSprintTasks(sprintId?: number) {
    if (!sprintId) {
      return [];
    }
    const query = sql
      .select('projecttask', ['id', 'name', 'description', 'typeId', 'priorityId'])
      .where({ projectSprintId: sprintId, statusId: 1 });
    const [tasks] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return tasks as TaskResponse[];
  }

  public async getNotMarkedSprintTasks(sprintId?: number) {
    if (!sprintId) {
      return [];
    }
    const query = sql
      .select('projecttask', ['id', 'name', 'description', 'typeId', 'priorityId'])
      .where({ projectSprintId: sprintId })
      .and({ points: null }, 'IS');
    const [tasks] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return tasks as TaskResponse[];
  }

  public async create(request: CreateTaskRequest) {
    const { id: creatorId } = await projectRepository.getProjectUserByUserId(
      request.creatorId,
      request.projectId,
    );
    const query = sql.insert('projecttask', { ...request, statusId: 1, creatorId });

    const [{ insertId }] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );

    return insertId;
  }

  public async update(request: Partial<UpdateTaskRequest>) {
    try {
      const model = {} as any;
      const specialKeys = ['id'];
      Object.keys(request)
        .filter((key) => specialKeys.indexOf(key) < 0)
        .forEach((key) => {
          model[key] = request[key];
        });

      let query = sql.update('projecttask', model).where({ id: request.id });

      dbConnection.query(getQueryText(query.text), query.values);

      if ('projectSprintId' in request) {
        query = sql
          .update('projectPlanningTaskSession', { isCanceled: true })
          .where({ taskId: request.id })
          .and({ resultValue: null }, 'IS');
        dbConnection.query(getQueryText(query.text), query.values);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  public async updateTaskStatus(taskId: number, statusId: number) {
    const query = sql
      .update('projecttask', {
        statusId,
      })
      .where({ id: taskId });
    dbConnection.query(getQueryText(query.text), query.values);
  }

  public async delete(taskId: number) {
    if (!taskId) {
      console.error('Укажите id задачи');
      return;
    }

    const query = sql.deletes('projecttask').where({ id: taskId });

    await dbConnection.query(getQueryText(query.text), query.values);
  }
}

export default new TaskRepository();
