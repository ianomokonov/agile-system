import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';

sql.use('mysql');

class RetroRepository {
  public async start(sprintId: number) {
    const query = sql.insert('projectRetro', {
      sprintId,
    });

    const [{ insertId: retroId }] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );
    return retroId;
  }

  public async read(retroId: number) {
    const query = sql
      .select('projectRetro', [
        'projectRetro.id',
        'projectRetro.createDate',
        'projectRetro.sprintId',
        'projectRetro.isFinished',
        'projectSprint.name as sprintName',
      ])
      .join('projectSprint', { sprintId: 'projectSprint.id' }, 'LEFT')
      .where({ 'projectRetro.id': retroId });
    const [[retro]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return retro;
  }

  public async getByProjectSprintId(sprintId: number) {
    if (!sprintId) {
      return null;
    }
    const query = sql.select('projectRetro', ['id', 'isFinished']).where({ sprintId });
    const [[retro]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return retro as { id: number; isFinished: number };
  }

  public async getRetroCards(retroId: number, userId: number) {
    const query = sql
      .select('projectRetroCard', [
        'projectRetroCard.id',
        'retroId',
        'category',
        'text',
        'user.name as userName',
        'user.surname as userSurname',
        `(user.id = ${userId}) as isMy`,
      ])
      .join('user', { 'projectRetroCard.userId': 'user.id' })
      .where({ retroId });
    const [cards] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return cards;
  }

  public async getOldRetroCards(retroId: number, projectId: number) {
    if (!retroId) {
      return [];
    }
    const query = sql
      .select('projectRetroCard', [
        'projectRetroCard.id',
        'retroId',
        'category',
        'text',
        'executorId',
        'isCompleted',
        'user.name as executorName',
        'user.surname as executorSurname',
      ])
      .join('projectUser', { 'projectRetroCard.executorId': 'projectUser.id' })
      .join('user', { 'projectUser.userId': 'user.id' })
      .join('projectRetro', { 'projectRetroCard.retroId': 'projectRetro.id' })
      .join('projectSprint', { 'projectRetro.sprintId': 'projectSprint.id' })
      .where({ retroId }, '!=')
      .and({ 'projectSprint.projectId': projectId })
      .and({ completeRetroId: retroId, isCompleted: false }, '=', 'OR');
    const [cards] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return cards;
  }

  public async finish(retroId: number) {
    const query = sql.update('projectRetro', { isFinished: true }).where({ id: retroId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
  }

  public async updateRetroCard(cardId: number, request) {
    const query = sql.update('projectRetroCard', request).where({ id: cardId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
  }
}

export default new RetroRepository();
