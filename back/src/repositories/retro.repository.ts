import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { RetroCardCategory } from '../models/retro-card-category';
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

  public async addCard(card) {
    const query = sql.insert('projectRetroCard', card);
    const [{ insertId: cardId }] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );
    return this.getCard(cardId);
  }

  public async addCardPoint(cardId, userId) {
    try {
      const query = sql.insert('retroCardPoint', { cardId, userId });
      const [{ insertId: pointId }] = await dbConnection.query<ResultSetHeader>(
        getQueryText(query.text),
        query.values,
      );
      return pointId;
    } catch (error) {
      await this.removeCardPoint(cardId, userId);
      return null;
    }
  }

  public async removeCardPoint(cardId, userId) {
    const query = sql.deletes('retroCardPoint').where({ cardId, userId });
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }

  public async removeCard(cardId: number) {
    const query = sql.deletes('projectRetroCard').where({ id: cardId });

    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }

  public async read(retroId: number) {
    const query = sql
      .select('projectRetro', [
        'projectRetro.id',
        'projectRetro.createDate',
        'projectRetro.sprintId',
        'projectRetro.isFinished',
        'projectSprint.name as sprintName',
        'projectSprint.projectId',
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

  public async getRetroPoints(retroId: number, userId: number) {
    const query = sql
      .select('retroCardPoint', [
        'retroCardPoint.id',
        'retroCardPoint.userId',
        'retroCardPoint.cardId',
        `(user.id = ${userId}) as isMy`,
      ])
      .join('user', { 'retroCardPoint.userId': 'user.id' })
      .join('projectRetroCard', { 'projectRetroCard.id': 'retroCardPoint.cardId' })
      .where({ 'projectRetroCard.retroId': retroId });
    const [points] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return points;
  }

  public async getRetroCards(retroId: number, userId: number) {
    const query = sql
      .select('projectRetroCard', [
        'projectRetroCard.id',
        'retroId',
        'category',
        'text',
        'fontSize',
        'taskId',
        'user.name as userName',
        'user.surname as userSurname',
        `(user.id = ${userId}) as isMy`,
      ])
      .join('user', { 'projectRetroCard.userId': 'user.id' })
      .where({ retroId })
      .orderby('id');
    const [cards] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return cards;
  }

  private async getCard(cardId: number, userId = 0) {
    const query = sql
      .select('projectRetroCard', [
        'projectRetroCard.id',
        'retroId',
        'category',
        'text',
        'fontSize',
        'taskId',
        'user.name as userName',
        'user.surname as userSurname',
        `(user.id = ${userId}) as isMy`,
      ])
      .join('user', { 'projectRetroCard.userId': 'user.id' })
      .where({ 'projectRetroCard.id': cardId });
    const [[card]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return card;
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
        'taskId',
        'isCompleted',
      ])
      .join('projectRetro', { 'projectRetroCard.retroId': 'projectRetro.id' })
      .join('projectSprint', { 'projectRetro.sprintId': 'projectSprint.id' })
      .where({ retroId }, '!=')
      .and({ 'projectSprint.projectId': projectId, category: RetroCardCategory.Actions })
      .and({ completeRetroId: retroId, isCompleted: false }, '=', 'OR');

    const [cards] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return cards;
  }

  public async getOldRetroCard(cardId: number) {
    const query = sql
      .select('projectRetroCard', [
        'projectRetroCard.id',
        'retroId',
        'category',
        'text',
        'isCompleted',
        'user.name as executorName',
        'user.surname as executorSurname',
      ])
      .join('projectRetro', { 'projectRetroCard.retroId': 'projectRetro.id' })
      .join('projectSprint', { 'projectRetro.sprintId': 'projectSprint.id' })
      .where({ 'projectRetroCard.id': cardId });

    const [[card]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );
    return card;
  }

  public async finish(retroId: number) {
    const query = sql.update('projectRetro', { isFinished: true }).where({ id: retroId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
  }

  public async updateRetroCard(cardId: number, request) {
    const query = sql.update('projectRetroCard', request).where({ id: cardId });
    await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
    return this.getCard(cardId);
  }
}

export default new RetroRepository();
