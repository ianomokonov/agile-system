import { StatusCodes } from 'http-status-codes';
import { WebError } from '../models/error';
import { PlanningUpdateRequest } from '../models/requests/planning-update.request';
import planningRepository from '../repositories/planning.repository';
import taskService from './task-service';

class PlanningService {
  public async start(projectId: number, sprintId: number, activeSprintId: number) {
    return planningRepository.start(projectId, sprintId, activeSprintId);
  }
  public async getList(projectId: number) {
    return planningRepository.getList(projectId);
  }

  public async read(planningId: number) {
    const planning = await planningRepository.read(planningId);
    if (!planning) {
      throw new WebError(StatusCodes.NOT_FOUND, 'Планирование не найдено');
    }
    const [newTasks, notMarkedTasks] = await Promise.all([
      taskService.getNewSprintTasks(planning?.activeSprintId),
      taskService.getNotMarkedSprintTasks(planning?.sprintId),
    ]);

    planning.newTasks = newTasks;
    planning.notMarkedTasks = notMarkedTasks;
    return planning;
  }

  public async update(planningId: number, request: PlanningUpdateRequest) {
    return planningRepository.update(planningId, request);
  }
}

export default new PlanningService();
