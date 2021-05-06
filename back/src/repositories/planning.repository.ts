import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';
import { PlanningFullView } from '../models/responses/planning';
import { PlanningUpdateRequest } from '../models/requests/planning-update.request';
// eslint-disable-next-line import/no-cycle
import taskRepository from './task.repository';

sql.use('mysql');

class PlanningRepository {
  public async start(projectId: number, sprintId: number, activeSprintId: number) {
    const query = sql.insert('projectplanning', {
      projectId,
      sprintId,
      activeSprintId,
    });

    const [result] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );

    return result?.insertId;
  }

  public async getBySprintId(sprintId: number) {
    const query = sql.select('projectplanning', '*').where({ activeSprintId: sprintId });
    const [[planning]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return planning;
  }

  public async update(planningId: number, request: PlanningUpdateRequest) {
    let query = sql.update('projectplanning', request).where({ id: planningId });

    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
    if (request.activeTaskId) {
      query = sql
        .update('projectplanningtasksession', { isCanceled: false })
        .where({ taskId: request.activeTaskId });
      await dbConnection.query(getQueryText(query.text), query.values);
    }
  }

  public async read(planningId: number) {
    const query = sql
      .select('projectplanning', [
        'projectplanning.id',
        'projectplanning.activeTaskId',
        'projectplanning.createDate',
        'projectplanning.sprintId',
        'projectplanning.activeSprintId',
        'projectsprint.name as sprintName',
      ])
      .join('projectsprint', { sprintId: 'projectsprint.id' }, 'LEFT')
      .where({ 'projectplanning.id': planningId });
    const [[planning]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    if (!planning) {
      return null;
    }
    planning.activeSessions = await this.getPlanningSessions(
      planning.sprintId || planning.activeSprintId,
      true,
    );
    planning.completedSessions = await this.getPlanningSessions(
      planning.sprintId || planning.activeSprintId,
      false,
    );
    return planning as PlanningFullView;
  }

  public async getSession(taskId: number, withCards = true, userId?: number) {
    const query = sql.select('projectplanningtasksession', '*').where({ taskId });
    const [[session]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    if (!session) {
      return null;
    }
    if (withCards) {
      session.cards = await this.getSessionCards(session.id, userId);
    }

    return session as any;
  }

  public async getPlanningSessions(sprintId: number, active) {
    let query = sql
      .select('projectplanningtasksession', [
        'projectplanningtasksession.id',
        'projectplanningtasksession.createDate',
        'projectplanningtasksession.taskId',
        'projectplanningtasksession.planningId',
        'projectplanningtasksession.showCards',
        'projectplanningtasksession.isCanceled',
      ])
      .join('projecttask', { 'projectplanningtasksession.taskId': 'projecttask.id' })
      .where({ 'projecttask.projectSprintId': sprintId });

    if (active) {
      query = query.and({ resultValue: null }, 'IS').and({ isCanceled: false });
    }
    if (!active && active !== undefined) {
      query = query.and({ resultValue: null }, 'IS NOT').or({ isCanceled: true });
    }

    let [sessions] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    sessions = await Promise.all(
      sessions.map(async (sessionTemp) => {
        const session = sessionTemp;
        session.task = await taskRepository.getShortTaskView(session.taskId);
        return session;
      }),
    );

    return sessions;
  }

  public async getSessionCards(sessionId: number, userId: number) {
    const query = sql
      .select('planningtasksessioncard', [
        'planningtasksessioncard.id',
        'planningtasksessioncard.value',
        'planningtasksessioncard.sessionId',
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

  public async resetSessionCards(sessionId: number, taskId: number, userId: number) {
    let query = sql.deletes('planningtasksessioncard').where({ sessionId });
    dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
    query = sql
      .update('projectplanningtasksession', { resultValue: null })
      .where({ id: sessionId });

    dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);

    await taskRepository.update({ id: taskId, points: null }, userId);
  }

  public async setShowCards(sessionId: number, showCards: boolean) {
    const query = sql.update('projectplanningtasksession', { showCards }).where({ id: sessionId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
  }

  public async getSessionCard(sessionId: number, userId: number) {
    const query = sql.select('planningtasksessioncard', ['id']).where({ sessionId, userId });
    const [[card]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return card;
  }

  public async createSession(planningId: number, taskId: number) {
    let query = sql.insert('projectplanningtasksession', {
      planningId,
      taskId,
    });
    let sessionId = 0;

    try {
      [{ insertId: sessionId }] = await dbConnection.query<ResultSetHeader>(
        getQueryText(query.text),
        query.values,
      );
    } catch (error) {
      query = sql.select('projectplanningtasksession', '*').where({ taskId });
      const [[session]] = await dbConnection.query<RowDataPacket[]>(
        getQueryText(query.text),
        query.values,
      );
      sessionId = session.id;
    }

    return sessionId;
  }

  public async setSessionCard(sessionId: number, userId: number, value: number, cardId) {
    let query = sql.insert('planningtasksessioncard', {
      sessionId,
      userId,
      value,
    });
    if (cardId) {
      query = sql.update('planningtasksessioncard', { value }).where({ id: cardId });
    }

    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);

    return this.getSessionCard(sessionId, userId);
  }

  public async closeSession(sessionId: number, value: number) {
    const query = sql
      .update('projectplanningtasksession', { resultValue: value })
      .where({ id: sessionId });

    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }
}

export default new PlanningRepository();
