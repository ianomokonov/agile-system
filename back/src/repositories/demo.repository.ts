import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';
// eslint-disable-next-line import/no-cycle
import projectRepository from './project.repository';
// eslint-disable-next-line import/no-cycle
import taskRepository from './task.repository';

sql.use('mysql');

class DemoRepository {
  public async start(projectId: number, sprintId: number) {
    const query = sql.insert('projectdemo', {
      projectId,
      sprintId,
    });

    const [{ insertId: demoId }] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );
    await dbConnection.query<ResultSetHeader>(
      `INSERT INTO projectdemotask (taskId, demoId) SELECT pt.id, ${demoId} FROM projecttask pt WHERE pt.statusId=4 AND pt.projectSprintId=${sprintId}`,
    );
    return demoId;
  }

  public async read(demoId: number, userId) {
    const query = sql
      .select('projectdemo', [
        'projectdemo.id',
        'projectdemo.createDate',
        'projectdemo.sprintId',
        'projectdemo.isFinished',
        'projectsprint.name as sprintName',
      ])
      .join('projectsprint', { sprintId: 'projectsprint.id' }, 'LEFT')
      .where({ 'projectdemo.id': demoId });
    const [[demo]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    if (!demo) {
      return null;
    }
    [demo.taskToShow, demo.shownTasks] = await this.getDemoTasks(demo.id, userId);

    return demo;
  }

  public async getByProjectSprintId(sprintId: number) {
    if (!sprintId) {
      return null;
    }
    const query = sql.select('projectdemo', ['id', 'isFinished']).where({ sprintId });
    const [[demo]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    if (!demo) {
      return null;
    }

    return demo as { id: number; isFinished: number };
  }

  private async getDemoTasks(demoId: number, userId) {
    const query = sql.select('projectdemotask', '*').where({ demoId });
    let [tasks] = await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
    tasks = await Promise.all(
      tasks.map(async (taskTemp) => {
        const task = taskTemp;
        task.task = await taskRepository.read(task.taskId);
        task.task.criteria = await taskRepository.getTaskAcceptanceCriteria(task.taskId);
        task.task.epic = await projectRepository.getEpic(task.task.epicId);
        task.task.comments = await taskRepository.getTaskComments(task.taskId, userId);
        return task;
      }),
    );
    return [tasks.filter((t) => !t.isFinished), tasks.filter((t) => t.isFinished)];
  }

  public async setActiveTask(demoId: number, taskId: number) {
    const query = sql.update('projectdemo', { activeTaskId: taskId }).where({ id: demoId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
  }

  public async finish(demoId: number) {
    let query = sql.update('projectdemo', { isFinished: true }).where({ id: demoId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);

    query = sql.update('projectdemotask', { isFinished: true }).where({ demoId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
  }

  public async finishDemoTask(demoTaskId: number) {
    const query = sql.update('projectdemotask', { isFinished: true }).where({ id: demoTaskId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
  }

  public async reopenDemoTask(demoTaskId: number, userId: number) {
    let query = sql.select('projectdemotask', '*').where({ id: demoTaskId });
    const [[demoTask]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    query = sql.update('projectdemotask', { isFinished: true }).where({ id: demoTaskId });
    await Promise.all([
      dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values),
      taskRepository.updateTaskStatus(demoTask.taskId, 1, userId),
    ]);
  }
}

export default new DemoRepository();
