import { TaskType } from 'back/src/models/task-type';
import { Priority } from 'back/src/models/priority';

export const authTokenKey = 'agileAuthToken';
export const refreshTokenKey = 'agileRefreshToken';

export const priorities = [
  {
    id: Priority.Low,
    name: 'Низкий',
  },
  {
    id: Priority.Medium,
    name: 'Средний',
  },
  {
    id: Priority.Hight,
    name: 'Высокий',
  },
  {
    id: Priority.Critical,
    name: 'Критический',
  },
];

export const taskTypes = [
  {
    id: TaskType.Feature,
    name: 'Feature',
  },
  {
    id: TaskType.Task,
    name: 'Task',
  },
  {
    id: TaskType.Bug,
    name: 'Bug',
  },
];
