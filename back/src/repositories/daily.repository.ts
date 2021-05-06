import { ResultSetHeader, RowDataPacket } from 'mysql2';
import * as sql from 'sql-query-generator';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';

sql.use('mysql');

class DailyRepository {
  public async read(projectId: number) {
    let query = sql.select('projectdaily', '*').where({ projectId });
    let [[daily]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    if (!daily) {
      query = sql.insert('projectdaily', {
        projectId,
      });

      // eslint-disable-next-line no-param-reassign
      await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
      query = sql.select('projectdaily', '*').where({ projectId });
      [[daily]] = await dbConnection.query<RowDataPacket[]>(getQueryText(query.text), query.values);
    }

    daily.participants = await this.getDailyParticipants(daily.id);

    return daily;
  }
  public async start(dailyId: number) {
    const query = sql
      .update('projectdaily', {
        isActive: true,
      })
      .where({ id: dailyId });

    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);

    return this.next(dailyId);
  }
  public async stop(dailyId: number) {
    let query = sql
      .update('projectdaily', {
        isActive: false,
      })
      .where({ id: dailyId });

    dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
    query = sql
      .update('projectdailyparticipant', { isDone: false, isActive: false })
      .where({ dailyId });
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }

  public async updateParticipant(participantId: number, request) {
    const query = sql.update('projectdailyparticipant', request).where({ id: participantId });
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
      .select('projectdailyparticipant', [
        'projectdailyparticipant.id',
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
    const query = sql.deletes('projectdailyparticipant').where({ id: participantId });
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }

  public async getParticipantId(userId: number, dailyId: number) {
    let query = sql.select('projectdailyparticipant', ['id']).where({ userId, dailyId });
    const [[participant]] = await dbConnection.query<RowDataPacket[]>(
      getQueryText(query.text),
      query.values,
    );

    if (participant) {
      return participant.id;
    }
    query = sql.insert('projectdailyparticipant', { userId, dailyId });
    // eslint-disable-next-line no-param-reassign
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
    return this.getParticipantId(userId, dailyId);
  }
}

export default new DailyRepository();
