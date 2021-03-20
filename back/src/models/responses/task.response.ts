import { StatusResponse } from './status.response';
import { UserShortView } from './user-short-view';

export interface TaskResponse {
  id: number;
  name: string;
  description: string;
  status: StatusResponse;
  typeId: number;
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
