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

  public async getSession(planningId: number, taskId: number, userId: number) {
    const query = sql.select('projectPlanningTaskSession', '*').where({ planningId, taskId });
    const [[session]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    session.cards = await this.getSessionCards(session.id, userId);

    return session;
  }

  public async getSessionCards(sessionId: number, userId: number) {
    const query = sql
      .select('planningTaskSessionCard', [
        'planningTaskSessionCard.id',
        'planningTaskSessionCard.value',
        'planningTaskSessionCard.sessionId',
        'user.name as userName',
        'user.surname as userSurname',
        'user.id as userId',
      ])
      .join('user', { userId: 'user.id' })
      .where({ sessionId });
    const [cards] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return cards.map((card) => {
      const isMy = card.userId === userId;
      // eslint-disable-next-line no-param-reassign
      delete card.userId;

      return { ...card, isMy };
    });
  }

  public async getSessionCard(sessionId: number, userId: number) {
    const query = sql.select('planningTaskSessionCard', ['id']).where({ sessionId, userId });
    const [[card]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return card;
  }

  public async createSession(planningId: number, taskId: number) {
    const query = sql.insert('projectPlanningTaskSession', {
      planningId,
      taskId,
    });

    const [result] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );

    return result?.insertId;
  }

  public async setSessionCard(sessionId: number, userId: number, value: number, cardId) {
    let query = sql.insert('planningTaskSessionCard', {
      sessionId,
      userId,
      value,
    });
    if (cardId) {
      query = sql.update('planningTaskSessionCard', { value }).where({ id: cardId });
    }

    const [result] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );

    return result?.insertId;
  }

  public async closeSession(sessionId: number) {
    const query = sql.deletes('projectPlanningTaskSession').where({ sessionId });

    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }
}

export default new PlanningRepository();
