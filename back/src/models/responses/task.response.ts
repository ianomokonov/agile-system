import { Priority } from '../priority';
import { TaskType } from '../task-type';
import { IdNameResponse } from './id-name.response';
import { StatusResponse } from './status.response';
import { UserShortView } from './user-short-view';

export interface TaskResponse {
  id: number;
  name: string;
  description: string;
  status: StatusResponse;
  priorityId: Priority;
  typeId: TaskType;
  sprint: IdNameResponse;
  epicId: number;
  parentId: number;
  projectUser: UserShortView;
  creator: UserShortView;
  points: number;
  projectId: number;
  lastEditDate: Date;
  createDate: Date;
  projectSprintId: number;
}
