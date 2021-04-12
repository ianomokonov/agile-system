import { StatusCodes } from 'http-status-codes';
import { WebError } from '../models/error';
import { PlanningUpdateRequest } from '../models/requests/planning-update.request';
import planningRepository from '../repositories/planning.repository';
import taskRepository from '../repositories/task.repository';
import taskService from './task-service';

class PlanningService {
  public async start(projectId: number, sprintId: number, activeSprintId: number) {
    return planningRepository.start(projectId, sprintId, activeSprintId);
  }

  public async read(projectId: number, shortView = false) {
    const planning = await planningRepository.read(projectId);
    if (!planning) {
      return null;
    }
    if (!shortView) {
      const [newTasks, notMarkedTasks] = await Promise.all([
        taskService.getNewSprintTasks(planning?.activeSprintId),
        taskService.getNotMarkedSprintTasks(planning?.sprintId),
      ]);

      planning.newTasks = newTasks;
      planning.notMarkedTasks = notMarkedTasks;
    }

    return planning;
  }

  public async update(planningId: number, request: PlanningUpdateRequest) {
    if (request.activeTaskId) {
      planningRepository.createSession(planningId, request.activeTaskId);
    }
    return planningRepository.update(planningId, request);
  }

  public async getSession(planningId: number, taskId: number, userId: number) {
    const session = await planningRepository.getSession(planningId, taskId, userId);
    if (!session) {
      throw new WebError(StatusCodes.NOT_FOUND, 'Сессия не найдена');
    }

    session.task = await taskRepository.read(taskId);
    return session;
  }

  public async setCard(sessionId: number, userId: number, value: number) {
    const card = await planningRepository.getSessionCard(sessionId, userId);
    return planningRepository.setSessionCard(sessionId, userId, value, card?.id);
  }

  public async reset(sessionId: number) {
    planningRepository.setShowCards(sessionId, false);
    return planningRepository.resetSessionCards(sessionId);
  }

  public async setShowCards(sessionId: number, showCards: boolean) {
    return planningRepository.setShowCards(sessionId, showCards);
  }

  public async closeSession(sessionId: number, value: number, taskId: number) {
    await Promise.all([
      planningRepository.closeSession(sessionId, value),
      taskRepository.update({ id: taskId, points: value }),
    ]);
  }
}

export default new PlanningService();
