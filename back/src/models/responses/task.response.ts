import { IdNameResponse } from './id-name.response';
import { StatusResponse } from './status.response';
import { TaskShortView } from './task-short-view';
import { UserShortView } from './user-short-view';

export interface TaskResponse extends TaskShortView {
  description: string;
  status: StatusResponse;
  sprint: IdNameResponse;
  epicId: number;
  parentId: number;
  creator: UserShortView;
  points: number;
  projectId: number;
  lastEditDate: Date;
  projectSprintId: number;
  activeSessionId?: number;
  files?: { name: string; url: string; id: number }[];
  history?: {
    id: number;
    fieldName: string;
    newValue: string;
    createDate: Date;
    userName: string;
    userSurname: string;
    user?: UserShortView;
    sprint?: IdNameResponse;
    status?: StatusResponse;
  }[];
}
