import { ResultSetHeader } from 'mysql2';
import * as sql from 'sql-query-generator';
import { getQueryText } from '../utils';
import dbConnection from './db-connection';

sql.use('mysql');

class DailyRepository {
  public async start(projectId: number, dailyId: number) {
    if (!dailyId) {
      const query = sql.insert('projectDaily', {
        projectId,
        isActive: true,
      });

      // eslint-disable-next-line no-param-reassign
      [{ insertId: dailyId }] = await dbConnection.query<ResultSetHeader>(
        getQueryText(query.text),
        query.values,
      );
    }

    let query = sql.select('projectDailyParticipant', '*').where({ dailyId });

    // eslint-disable-next-line no-param-reassign
    // const [participants] = await dbConnection.query>(
    //   getQueryText(query.text),
    //   query.values,
    // );

    query = sql.update('projectDaily', {
      isActive: true,
    });

    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }

  public async enter(projectId: number, userId: number, dailyId: number) {
    if (!dailyId) {
      const query = sql.insert('projectDaily', {
        projectId,
      });

      // eslint-disable-next-line no-param-reassign
      [{ insertId: dailyId }] = await dbConnection.query<ResultSetHeader>(
        getQueryText(query.text),
        query.values,
      );
    }
    let query = sql.deletes('projectDailyParticipant').where({ userId, dailyId });
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);

    query = sql.insert('projectDailyParticipant', { userId, dailyId });
    const [{ insertId: participantId }] = await dbConnection.query<ResultSetHeader>(
      getQueryText(query.text),
      query.values,
    );
    return participantId;
  }

  public async exit(participantId: number) {
    const query = sql.deletes('projectDailyParticipant').where({ id: participantId });
    await dbConnection.query<ResultSetHeader>(getQueryText(query.text), query.values);
  }
}

export default new DailyRepository();
