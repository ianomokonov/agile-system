import { StatusCodes } from 'http-status-codes';
import { WebError } from '../models/error';
import { PlanningUpdateRequest } from '../models/requests/planning-update.request';
import { PlanningStep } from '../models/responses/planning';
import planningRepository from '../repositories/planning.repository';
import taskRepository from '../repositories/task.repository';
import taskService from './task-service';

class PlanningService {
  // public async start(projectId: number, sprintId: number, activeSprintId: number) {
  //   return planningRepository.start(projectId, sprintId, activeSprintId);
  // }

  // eslint-disable-next-line complexity
  public async read(planningId: number, shortView = false) {
    const planning = await planningRepository.read(planningId);
    if (!planning) {
      return null;
    }
    if (!shortView) {
      if (planning.sprintId) {
        const [newTasks, notMarkedTasks] = await Promise.all([
          taskService.getNewSprintTasks(planning?.activeSprintId),
          taskService.getNotMarkedSprintTasks(planning?.sprintId),
        ]);

        planning.newTasks = newTasks;
        planning.notMarkedTasks = notMarkedTasks;
      } else {
        const notMarkedTasks = await taskService.getNotMarkedSprintTasks(planning?.activeSprintId);
        planning.notMarkedTasks = notMarkedTasks;
      }

      planning.activeStep = PlanningStep.MarkTasks;
      if (planning.newTasks?.length) {
        planning.activeStep = PlanningStep.NewTasks;
      }
    }

    return planning;
  }

  public async update(planningId: number, request: PlanningUpdateRequest) {
    const update = planningRepository.update(planningId, request);
    if (request.activeTaskId) {
      return planningRepository.createSession(planningId, request.activeTaskId);
    }

    return update;
  }

  public async getSession(taskId: number, userId: number) {
    const session = await planningRepository.getSession(taskId, true, userId);
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

  public async reset(sessionId: number, taskId: number, userId) {
    planningRepository.setShowCards(sessionId, false);
    return planningRepository.resetSessionCards(sessionId, taskId, userId);
  }

  public async setShowCards(sessionId: number, showCards: boolean) {
    return planningRepository.setShowCards(sessionId, showCards);
  }

  public async closeSession(sessionId: number, value: number, taskId: number, userId: number) {
    await Promise.all([
      planningRepository.closeSession(sessionId, value),
      taskRepository.update({ id: taskId, points: value }, userId),
    ]);
  }
}

export default new PlanningService();
