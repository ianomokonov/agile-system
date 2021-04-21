import { Priority } from '../priority';
import { TaskType } from '../task-type';
import { UserShortView } from './user-short-view';

export interface TaskShortView {
  id: number;
  name: string;
  statusId: number;
  createDate: Date;
  projectId: number;
  priorityId: Priority;
  typeId: TaskType;
  points: number;
  projectSprintId: number;
  projectUser: UserShortView;
}
