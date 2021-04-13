import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';
import taskRepository from './task.repository';

sql.use('mysql');

class DemoRepository {
  public async start(projectId: number, sprintId: number) {
    const query = sql.insert('projectDemo', {
      projectId,
      sprintId,
    });

    const [{ insertId: demoId }] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );
    await dbConnection.query<ResultSetHeader>(
      `INSERT INTO projectDemoTask (taskId, demoId) SELECT pt.id, ${demoId} FROM projecttask pt WHERE pt.statusId=7 AND pt.projectSprintId=${sprintId}`,
    );
    return demoId;
  }

  public async read(projectId: number, shortView = false) {
    const query = sql
      .select('projectDemo', [
        'projectDemo.id',
        'projectDemo.createDate',
        'projectDemo.sprintId',
        'projectDemo.isFinished',
        'projectSprint.name as sprintName',
      ])
      .join('projectSprint', { sprintId: 'projectSprint.id' }, 'LEFT')
      .where({ 'projectDemo.projectId': projectId, 'projectDemo.isFinished': false });
    const [[demo]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    if (!demo) {
      return null;
    }
    if (!shortView) {
      [demo.taskToShow, demo.shownTasks] = await this.getDemoTasks(demo.id);
    }

    return demo;
  }

  private async getDemoTasks(demoId: number) {
    const query = sql.select('projectDemoTask', '*').where({ demoId });
    let [tasks] = await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
    tasks = await Promise.all(
      tasks.map(async (taskTemp) => {
        const task = taskTemp;
        task.task = await taskRepository.read(task.taskId);
        return task;
      }),
    );
    return [tasks.filter((t) => !t.isFinished), tasks.filter((t) => t.isFinished)];
  }

  public async finish(demoId: number) {
    let query = sql.update('projectDemo', { isFinished: true }).where({ id: demoId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);

    query = sql.update('projectDemoTask', { isFinished: true }).where({ demoId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
  }

  public async finishDemoTasks(demoTaskId: number) {
    const query = sql.update('projectDemoTask', { isFinished: true }).where({ id: demoTaskId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
  }
}

export default new DemoRepository();
