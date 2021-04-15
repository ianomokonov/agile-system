import retroService from '../services/retro.service';

export class PlanningHandler {
  public async start(sprintId: number) {
    return retroService.start(sprintId);
  }
  public async read(id, userId) {
    return retroService.read(id, userId);
  }

  public async finish(id: number) {
    return retroService.finish(id);
  }

  public async updateCard(cardId: number, request) {
    return retroService.updateCard(cardId, request);
  }

  public async createCard(retroId: number, request) {
    return retroService.createCard(retroId, request);
  }

  public async removeCard(cardId: number) {
    return retroService.removeCard(cardId);
  }
}

export default new PlanningHandler();
