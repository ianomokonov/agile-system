import { CRUD } from '../models/crud.interface';
import { CreateTaskRequest, UpdateTaskRequest } from '../models/task.models';
import taskRepository from '../repositories/task.repository';

class TaskService implements CRUD<CreateTaskRequest, UpdateTaskRequest> {
  public async create(request: CreateTaskRequest) {
    return taskRepository.create(request);
  }
  public async update(request: UpdateTaskRequest) {
    taskRepository.update(request);
  }
  public async read(id: number) {
    return taskRepository.read(id);
  }
  public async delete(id: number) {
    taskRepository.delete(id);
  }
  public async getTaskProjectId(taskId: number): Promise<number> {
    return taskRepository.getProjectId(taskId);
  }
}

export default new TaskService();
