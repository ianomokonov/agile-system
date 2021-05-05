import { Priority } from '../priority';
import { TaskType } from '../task-type';

export interface CreateTaskRequest {
  name: string;
  description: string;
  projectUserId?: number;
  creatorId?: number;
  priorityId: Priority;
  typeId: TaskType;
  projectSprintId?: number;
  files?: any[];
  retroCardId?: number;
}

export interface UpdateTaskRequest {
  id: number;
  name: string;
  description: string;
  projectUserId?: number;
  userId?: number;
  projectId?: number;
  statusId: number;
  typeId: number;
  projectSprintId?: number | null;
  epicId?: number | null;
  priorityId: number;
  points: number;
}
