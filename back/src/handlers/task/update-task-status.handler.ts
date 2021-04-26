import taskService from '../../services/task-service';

export default async (taskId: number, statusId: number, userId: number) => {
  return taskService.updateTaskStatus(taskId, statusId, userId);
};
