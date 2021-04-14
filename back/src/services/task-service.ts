import { StatusCodes } from 'http-status-codes';
import { WebError } from '../models/error';
import { CreateTaskRequest, UpdateTaskRequest } from '../models/requests/task.models';
import projectRepository from '../repositories/project.repository';
import taskRepository from '../repositories/task.repository';

class TaskService {
  public async create(projectId: number, request: CreateTaskRequest) {
    if (request.projectUserId) {
      const user = await projectRepository.getProjectUser(request.projectUserId);
      if (!user) {
        throw new WebError(StatusCodes.BAD_REQUEST, 'Неверно указан исполнитель');
      }
    }

    return taskRepository.create(projectId, request);
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

  public async getNotMarkedSprintTasks(sprintId: number) {
    return taskRepository.getNotMarkedSprintTasks(sprintId);
  }

  public async getNewSprintTasks(sprintId: number) {
    return taskRepository.getNewSprintTasks(sprintId);
  }
}

export default new TaskService();
