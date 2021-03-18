import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { CRUD } from '../models/crud.interface';
import { CreateTaskRequest, UpdateTaskRequest } from '../models/requests/task.models';
import { StatusResponse } from '../models/responses/status.response';
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
    const [status, user, creator] = await Promise.all([
      await this.getStatus(task.statusId),
      projectRepository.getProjectUser(task.projectUserId),
      projectRepository.getProjectUser(task.creatorId),
    ]);

    task.status = status;
    task.projectUser = user;
    task.creator = creator;
    return task as TaskResponse;
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

  public async update(request: UpdateTaskRequest) {
    const model = {} as any;
    if ('name' in request) {
      model.name = request.name;
    }
    if ('description' in request) {
      model.description = request.description;
    }
    if ('projectUserId' in request) {
      if (+request.projectUserId < 0) {
        const { id } = await projectRepository.getProjectUserByUserId(
          request.userId,
          request.projectId,
        );

        request.projectUserId = id;
      }
      model.projectUserId = request.projectUserId;
    }
    const query = sql.update('projecttask', model).where({ id: request.id });

    dbConnection.query(getQueryText(query.text), query.values);
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
