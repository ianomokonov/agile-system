import path from 'path';
import { CreateTaskRequest, UpdateTaskRequest } from '../../models/requests/task.models';
import taskService from '../../services/task-service';
import { removeFile } from '../../utils';

export class TasksHandler {
  public async create(projectId: number, request: CreateTaskRequest) {
    return taskService.create(projectId, request);
  }
  public async update(request: Partial<UpdateTaskRequest>) {
    return taskService.update(request);
  }
  public async read(taskId: number) {
    return taskService.read(taskId);
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
}

export default new TasksHandler();
