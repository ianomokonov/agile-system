import path from 'path';
import { CreateTaskRequest, UpdateTaskRequest } from '../../models/requests/task.models';
import taskService from '../../services/task-service';
import { removeFile } from '../../utils';

export class TasksHandler {
  public async create(projectId: number, request: CreateTaskRequest) {
    return taskService.create(projectId, request);
  }
  public async update(request: Partial<UpdateTaskRequest>, userId: number) {
    return taskService.update(request, userId);
  }
  public async read(taskId: number) {
    return taskService.read(taskId);
  }
  public async getHistory(taskId: number) {
    return taskService.getTaskHistory(taskId);
  }
  public async search(searchString: string, projectId: number) {
    return taskService.searchTasks(searchString, projectId);
  }
  public async delete(taskId: number) {
    return taskService.delete(taskId);
  }

  public async uploadFiles(taskId: number, files) {
    return taskService.uploadFiles(taskId, files);
  }

  public async getFileUrl(fileId) {
    const { url: fileName } = await taskService.getFile(fileId);
    if (fileName.indexOf('userimages') > -1) {
      const file = fileName.split('/userimages/')[1];
      return path.resolve(`./src/files/userimages/${file}`);
    }

    const file = fileName.split('/taskfiles/')[1];
    return path.resolve(`./src/files/taskfiles/${file}`);
  }

  public async removeFile(fileId: number) {
    const url = await taskService.removeFile(fileId);
    removeFile(url);
  }

  public async getTaskComments(taskId, userId) {
    return taskService.getTaskComments(taskId, userId);
  }

  public async createTaskComment(request) {
    return taskService.createTaskComment(request);
  }

  public async updateTaskComment(commentId, request, userId) {
    return taskService.updateTaskComment(commentId, request, userId);
  }

  public async removeTaskComment(commentId, userId) {
    return taskService.removeTaskComment(commentId, userId);
  }

  public async getTaskAcceptanceCriteria(taskId) {
    return taskService.getTaskAcceptanceCriteria(taskId);
  }

  public async createTaskAcceptanceCriteria(request) {
    return taskService.createTaskAcceptanceCriteria(request);
  }

  public async updateTaskAcceptanceCriteria(criteriaId, request) {
    return taskService.updateTaskAcceptanceCriteria(criteriaId, request);
  }

  public async removeTaskAcceptanceCriteria(criteriaId) {
    return taskService.removeTaskAcceptanceCriteria(criteriaId);
  }
}

export default new TasksHandler();
