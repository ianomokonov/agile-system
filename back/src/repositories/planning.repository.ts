import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';
import { PlanningStep } from '../models/responses/planning';
import { PlanningUpdateRequest } from '../models/requests/planning-update.request';

sql.use('mysql');

class PlanningRepository {
  public async start(projectId: number, sprintId: number, activeSprintId: number) {
    const query = sql.insert('projectplanning', {
      projectId,
      sprintId,
      activeSprintId,
      isActive: true,
      activeStep: activeSprintId ? PlanningStep.NewTasks : PlanningStep.MarkTasks,
    });

    const [result] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );

    return result?.insertId;
  }

  public async update(planningId: number, request: PlanningUpdateRequest) {
    const query = sql.update('projectplanning', request).where({ id: planningId });

    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
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
        'projectplanning.activeStep',
        'projectplanning.activeTaskId',
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
