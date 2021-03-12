import { StatusCodes } from 'http-status-codes';
import { CRUD } from '../models/crud.interface';
import { WebError } from '../models/error';
import { CreateTaskRequest, UpdateTaskRequest } from '../models/task.models';
import projectRepository from '../repositories/project.repository';
import taskRepository from '../repositories/task.repository';

class TaskService implements CRUD<CreateTaskRequest, UpdateTaskRequest> {
  public async create(request: CreateTaskRequest) {
    const user = await projectRepository.getProjectUser(request.projectId, request.projectUserId);
    if (!user) {
      throw new WebError(StatusCodes.BAD_REQUEST, 'Неверно указан исполнитель');
    }
    return taskRepository.create(request);
  }
  public async update(request: UpdateTaskRequest) {
    taskRepository.update(request);
  }
  public async updateTaskStatus(taskId: number, statusId: number) {
    taskRepository.updateTaskStatus(taskId, statusId);
  }
  public async read(id: number) {
    const task = await taskRepository.read(id);
    if (!task) {
      throw new WebError(StatusCodes.NOT_FOUND, 'Задача не найдена');
    }
    return task;
  }
  public async delete(id: number) {
    taskRepository.delete(id);
  }
  public async getTaskProjectId(taskId: number): Promise<number> {
    return taskRepository.getProjectId(taskId);
  }
}

export default new TaskService();
