import taskService from '../../services/task-service';

export default async (taskId: number, statusId: number) => {
  return taskService.updateTaskStatus(taskId, statusId);
};
