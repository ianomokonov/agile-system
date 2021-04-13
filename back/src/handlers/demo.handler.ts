import demoService from '../services/demo-service';

export class PlanningHandler {
  public async start(projectId: number, sprintId: number) {
    return demoService.start(projectId, sprintId);
  }
  public async read(projectId) {
    return demoService.read(projectId);
  }

  public async finishDemo(demoId: number) {
    return demoService.finishDemo(demoId);
  }

  public async finishTasks(demoId: number) {
    return demoService.finishTasks(demoId);
  }
}

export default new PlanningHandler();
