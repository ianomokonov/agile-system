import { Priority } from '../priority';
import { TaskType } from '../task-type';
import { ProjectEpicResponse } from './project-epic.response';
import { UserShortView } from './user-short-view';

export interface TaskShortView {
  id: number;
  name: string;
  statusId: number;
  createDate: Date;
  projectId: number;
  priorityId: Priority;
  epicId?: number;
  epic?: ProjectEpicResponse;
  typeId: TaskType;
  points: number;
  projectSprintId: number;
  projectUser: UserShortView;
}
