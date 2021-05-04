import demoService from '../services/demo-service';

export class PlanningHandler {
  public async start(projectId: number, sprintId: number) {
    return demoService.start(projectId, sprintId);
  }
  public async read(demoId) {
    return demoService.read(demoId);
  }

  public async finishDemo(demoId: number) {
    return demoService.finishDemo(demoId);
  }

  public async setActiveTask(demoId: number, taskId: number) {
    return demoService.setActiveTask(demoId, taskId);
  }

  public async finishTask(taskId: number) {
    return demoService.finishTask(taskId);
  }

  public async reopenTask(taskId: number, userId: number) {
    return demoService.reopenTask(taskId, userId);
  }
}

export default new PlanningHandler();
