import { CreateTaskRequest, UpdateTaskRequest } from '../../models/requests/task.models';
import taskService from '../../services/task-service';

export class TasksHandler {
  public async create(projectId: number, request: CreateTaskRequest) {
    return taskService.create(projectId, request);
  }
  public async update(request: UpdateTaskRequest) {
    return taskService.update(request);
  }
  public async read(taskId: number) {
    return taskService.read(taskId);
  }
  public async delete(taskId: number) {
    return taskService.delete(taskId);
  }
}

export default new TasksHandler();
