import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import logger from '../logger';
import { CreateTaskRequest, UpdateTaskRequest } from '../models/requests/task.models';
import { StatusResponse } from '../models/responses/status.response';
import { TaskShortView } from '../models/responses/task-short-view';
import { TaskResponse } from '../models/responses/task.response';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';
// eslint-disable-next-line import/no-cycle
import projectRepository from './project.repository';
import retroRepository from './retro.repository';

sql.use('mysql');

class TaskRepository {
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
    const [status, user, creator, sprints, history] = await Promise.all([
      this.getStatus(task.statusId),
      projectRepository.getProjectUser(task.projectUserId),
      projectRepository.getProjectUser(task.creatorId),
      projectRepository.getProjectSprintNames(task.projectId, task.projectSprintId),
      this.getTaskHistory(taskId),
    ]);

    task.status = status;
    task.projectUser = user;
    task.creator = creator;
    task.history = history;
    task.sprint = task.projectSprintId ? sprints[0] : null;
    task.files = await this.getFiles(taskId);
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
        'projectId',
        'createDate',
        'projectUserId',
        'projectSprintId',
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

  public async getTaskHistory(taskId: number) {
    if (!taskId) {
      return [];
    }
    const query = sql
      .select('taskHistoryOperations', [
        'taskHistoryOperations.id',
        'taskHistoryOperations.fieldName',
        'taskHistoryOperations.newValue',
        'taskHistoryOperations.createDate',
        'user.name as userName',
        'user.surname as userSurname',
      ])
      .join('user', { 'user.id': 'userId' })
      .where({ projectTaskId: taskId })
      .orderby('taskHistoryOperations.createDate DESC');
    let [historyItems] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    historyItems = await Promise.all(
      historyItems.map(async (itemTemp) => {
        const item = itemTemp;
        if (item.fieldName === 'projectUserId') {
          item.user = await projectRepository.getProjectUser(item.newValue);
        }
        if (item.fieldName === 'projecSprintId') {
          item.sprint = await projectRepository.getProjectSprintNames(null, item.newValue);
        }
        if (item.fieldName === 'statusId') {
          item.status = await this.getStatus(item.newValue);
        }
        return item;
      }),
    );

    return historyItems;
  }

  public async create(projectId: number, request: CreateTaskRequest) {
    const { retroCardId } = request;
    delete request.retroCardId;
    const { id: creatorId } = await projectRepository.getProjectUserByUserId(
      request.creatorId,
      projectId,
    );
    const query = sql.insert('projecttask', { ...request, statusId: 1, creatorId, projectId });

    const [{ insertId }] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );
    if (retroCardId) {
      retroRepository.updateRetroCard(retroCardId, { taskId: insertId });
    }
    return insertId;
  }

  public async uploadFiles(taskId: number, files: { name: string; url: string }[]) {
    const values = [];
    const query = `${`INSERT INTO projecttaskfiles (taskId, name, url) VALUES ${files
      .map((file) => {
        values.push(taskId, file.name, file.url);
        return `(?, ?, ?), `;
      })
      .join('')}`.replace(/,\s$/, '')};`;

    await dbConnection.query<ResultSetHeader>(query, values);
  }

  public async getFiles(taskId: number) {
    const query = sql.select('projectTaskFiles', '*').where({ taskId });

    const [files] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return files;
  }

  public async getFile(fileId) {
    const query = sql.select('projecttaskfiles', '*').where({ id: fileId });

    const [[file]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return file;
  }

  public async removeFile(fileId: number) {
    const { url } = await this.getFile(fileId);
    const query = sql.deletes('projecttaskfiles').where({ id: fileId });

    await dbConnection.query(getQueryText(query.text), query.values);
    return url;
  }

  // eslint-disable-next-line complexity
  public async update(request: Partial<UpdateTaskRequest>, userId: number, sprintId?: number) {
    try {
      if ('projectSprintId' in request) {
        const query = sql
          .update('projectPlanningTaskSession', { isCanceled: true })
          .where({ taskId: request.id })
          .and({ resultValue: null }, 'IS');
        dbConnection.query(getQueryText(query.text), query.values);
      }
      const model = { lastEditUserId: userId } as any;
      const specialKeys = ['id'];
      Object.keys(request)
        .filter((key) => specialKeys.indexOf(key) < 0)
        .forEach((key) => {
          model[key] = request[key];
        });

      let query = sql.update('projecttask', model);

      if (sprintId) {
        query = query.where({ projectSprintId: sprintId });
      } else {
        query = query.where({ id: request.id });
      }

      await dbConnection.query(getQueryText(query.text), query.values);

      if ('statusId' in request && request.statusId === 4) {
        const task = await this.getShortTaskView(request.id);

        if (!task.projectSprintId) {
          return;
        }
        query = sql
          .select('projectdemo', '*')
          .where({ sprintId: task.projectSprintId, isFinished: false });
        const [[demo]] = await dbConnection.query<RowDataPacket[]>(
          getQueryText(query.text),
          query.values,
        );

        if (demo) {
          query = sql.insert('projectdemotask', { demoId: demo.id, taskId: task.id });
          await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
        }
      }
    } catch (error) {
      logger.error(error);
    }
  }

  public async updateTaskStatus(taskId: number, statusId: number, userId: number) {
    this.update({ id: taskId, statusId }, userId);
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
