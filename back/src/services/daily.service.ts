import dailyRepository from '../repositories/daily.repository';

class DailyService {
  public async read(projectId: number) {
    return dailyRepository.read(projectId);
  }
}

export default new DailyService();
