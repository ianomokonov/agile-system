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
    const [newTasks, notMarkedTasks] = await Promise.all([
      taskService.getNewSprintTasks(planning.activeSprintId),
      taskService.getNotMarkedSprintTasks(planning.sprintId),
    ]);

    planning.newTasks = newTasks;
    planning.notMarkedTasks = notMarkedTasks;
    return planning;
  }
}

export default new PlanningService();
