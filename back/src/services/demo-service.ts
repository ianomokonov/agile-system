import demoRepository from '../repositories/demo.repository';

class DemoService {
  public async start(projectId: number, sprintId: number) {
    return demoRepository.start(projectId, sprintId);
  }
  public async read(id: number) {
    return demoRepository.read(id);
  }

  public async getBySprintId(id: number) {
    return demoRepository.getByProjectSprintId(id);
  }

  public async finishDemo(demoId: number) {
    return demoRepository.finish(demoId);
  }

  public async finishTasks(demoId: number) {
    return demoRepository.finishDemoTasks(demoId);
  }
}

export default new DemoService();
