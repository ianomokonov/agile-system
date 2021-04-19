import retroRepository from '../repositories/retro.repository';

class RetroService {
  public async start(sprintId: number) {
    return retroRepository.start(sprintId);
  }
  public async read(id: number, userId: number) {
    const retro = await retroRepository.read(id);
    if (!retro) {
      return null;
    }
    const [cards, oldCards] = await Promise.all([
      retroRepository.getRetroCards(id, userId),
      retroRepository.getOldRetroCards(id, retro.projectId),
    ]);

    retro.cards = cards;
    retro.oldCards = oldCards;

    return retro;
  }
  public async updateCard(cardId: number, request) {
    return retroRepository.updateRetroCard(cardId, request);
  }
  public async removeCard(cardId: number) {
    return retroRepository.removeCard(cardId);
  }

  public async createCard(request) {
    return retroRepository.addCard(request);
  }

  public async finish(id: number) {
    return retroRepository.finish(id);
  }

  public async getByProjectSprintId(sprintId) {
    return retroRepository.getByProjectSprintId(sprintId);
  }
}

export default new RetroService();
