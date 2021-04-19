import dailyService from '../services/daily.service';

export class DailyHandler {
  public async read(projectId) {
    return dailyService.read(projectId);
  }
}

export default new DailyHandler();
