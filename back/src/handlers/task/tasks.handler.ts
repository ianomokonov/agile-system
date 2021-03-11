import { CRUD } from '../../models/crud.interface';
import { CreateTaskRequest, UpdateTaskRequest } from '../../models/task.models';
import taskService from '../../services/task-service';

export class TasksHandler implements CRUD<CreateTaskRequest, UpdateTaskRequest> {
  public async create(request: CreateTaskRequest) {
    return taskService.create(request);
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
