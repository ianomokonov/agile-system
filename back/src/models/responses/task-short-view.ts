import { Priority } from '../priority';
import { TaskType } from '../task-type';
import { UserShortView } from './user-short-view';

export interface TaskShortView {
  id: string;
  name: string;
  statusId: number;
  createDate: Date;
  priorityId: Priority;
  typeId: TaskType;
  user: UserShortView;
}
