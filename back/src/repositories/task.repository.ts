import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { CRUD } from '../models/crud.interface';
import { CreateTaskRequest, UpdateTaskRequest } from '../models/task.models';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';

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

  public async read(taskId: number) {
    const [[task]] = await dbConnection.query<RowDataPacket[]>(`SELECT *
        FROM projecttask 
        WHERE id=${taskId}`);
    return task;
  }

  public async create(request: CreateTaskRequest) {
    const query = sql.insert('projecttask', { ...request, statusId: 1 });

    const [{ insertId }] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );

    return insertId;
  }

  public async update(request: UpdateTaskRequest) {
    const query = sql
      .update('projecttask', {
        name: request.name,
        description: request.description,
        projectUserId: request.projectUserId,
      })
      .where({ id: request.id });
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
