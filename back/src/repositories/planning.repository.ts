import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';

sql.use('mysql');

class PlanningRepository {
  public async start(projectId: number, sprintId: number, activeSprintId: number) {
    const query = sql.insert('projectplanning', {
      projectId,
      sprintId,
      activeSprintId,
      isActive: true,
    });

    const [result] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );

    return result?.insertId;
  }

  public async getList(projectId: number) {
    const query = sql
      .select('projectplanning', [
        'projectplanning.id',
        'projectplanning.isActive',
        'projectplanning.createDate',
        'projectplanning.sprintId',
        'projectplanning.activeSprintId',
        'projectSprint.name as sprintName',
      ])
      .join('projectSprint', { sprintId: 'projectSprint.id' }, 'LEFT')
      .where({ 'projectplanning.projectId': projectId });
    const [plannings] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return plannings;
  }

  public async read(planningId: number) {
    const query = sql
      .select('projectplanning', [
        'projectplanning.id',
        'projectplanning.isActive',
        'projectplanning.createDate',
        'projectplanning.sprintId',
        'projectplanning.activeSprintId',
        'projectSprint.name as sprintName',
      ])
      .join('projectSprint', { sprintId: 'projectSprint.id' }, 'LEFT')
      .where({ 'projectplanning.id': planningId });
    const [[planning]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return planning;
  }
}

export default new PlanningRepository();
