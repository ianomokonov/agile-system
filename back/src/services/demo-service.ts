import demoRepository from '../repositories/demo.repository';

class DemoService {
  public async start(projectId: number, sprintId: number) {
    return demoRepository.start(projectId, sprintId);
  }
  public async read(id: number) {
    return demoRepository.read(id);
  }

  public async setActiveTask(demoId: number, taskId: number) {
    return demoRepository.setActiveTask(demoId, taskId);
  }

  public async getBySprintId(id: number) {
    return demoRepository.getByProjectSprintId(id);
  }

  public async finishDemo(demoId: number) {
    return demoRepository.finish(demoId);
  }

  public async finishTask(taskId: number) {
    return demoRepository.finishDemoTask(taskId);
  }

  public async reopenTask(taskId: number, userId: number) {
    return demoRepository.reopenDemoTask(taskId, userId);
  }
}

export default new DemoService();
