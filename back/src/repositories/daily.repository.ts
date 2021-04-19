import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';

sql.use('mysql');

class DailyRepository {
  public async read(projectId: number) {
    let query = sql.select('projectDaily', '*').where({ projectId });
    let [[daily]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    if (!daily) {
      query = sql.insert('projectDaily', {
        projectId,
      });

      // eslint-disable-next-line no-param-reassign
      await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
      query = sql.select('projectDaily', '*').where({ projectId });
      [[daily]] = await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
    }

    daily.participants = await this.getDailyParticipants(daily.id);

    return daily;
  }
  public async start(dailyId: number) {
    const query = sql
      .update('projectDaily', {
        isActive: true,
      })
      .where({ id: dailyId });

    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);

    return this.next(dailyId);
  }
  public async stop(dailyId: number) {
    let query = sql
      .update('projectDaily', {
        isActive: false,
      })
      .where({ id: dailyId });

    dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
    query = sql
      .update('projectDailyParticipant', { isDone: false, isActive: false })
      .where({ dailyId });
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }

  public async updateParticipant(participantId: number, request) {
    const query = sql.update('projectDailyParticipant', request).where({ id: participantId });
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }

  public async next(dailyId: number) {
    const participants = await this.getDailyParticipants(dailyId);
    const activeIndex = participants.findIndex((p) => p.isActive);
    if (activeIndex < 0) {
      participants[participants.length - 1].isActive = true;
      this.updateParticipant(participants[participants.length - 1].id, { isActive: true });
      return participants;
    }
    participants[activeIndex].isActive = false;
    participants[activeIndex].isDone = true;
    this.updateParticipant(participants[activeIndex].id, {
      isActive: false,
      isDone: true,
    });
    if (participants[activeIndex - 1]) {
      participants[activeIndex - 1].isActive = true;
      this.updateParticipant(participants[activeIndex - 1].id, { isActive: true });
    }

    return participants;
  }

  public async getDailyParticipants(dailyId: number) {
    const query = sql
      .select('projectDailyParticipant', [
        'projectDailyParticipant.id',
        'isDone',
        'isActive',
        'dailyId',
        'minutes',
        'seconds',
        'user.name as userName',
        'user.surname as userSurname',
      ])
      .join('user', { userId: 'user.id' })
      .where({ dailyId })
      .orderby(['isDone', 'isActive']);

    const [participants] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    return participants;
  }

  public async enter(userId: number, dailyId: number) {
    const id = await this.getParticipantId(userId, dailyId);
    return [id, await this.getDailyParticipants(dailyId)];
  }

  public async exit(participantId: number) {
    const query = sql.deletes('projectDailyParticipant').where({ id: participantId });
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }

  public async getParticipantId(userId: number, dailyId: number) {
    let query = sql.select('projectDailyParticipant', ['id']).where({ userId, dailyId });
    const [[participant]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    if (participant) {
      return participant.id;
    }
    query = sql.insert('projectDailyParticipant', { userId, dailyId });
    // eslint-disable-next-line no-param-reassign
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
    return this.getParticipantId(userId, dailyId);
  }
}

export default new DailyRepository();
