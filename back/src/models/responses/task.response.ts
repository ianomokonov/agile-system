import { IdNameResponse } from './id-name.response';
import { ProjectEpicResponse } from './project-epic.response';
import { StatusResponse } from './status.response';
import { TaskShortView } from './task-short-view';
import { UserShortView } from './user-short-view';

export interface TaskResponse extends TaskShortView {
  description: string;
  status: StatusResponse;
  sprint: IdNameResponse;
  epicId: number;
  epic?: ProjectEpicResponse;
  parentId: number;
  creator: UserShortView;
  points: number;
  projectId: number;
  lastEditDate: Date;
  projectSprintId: number;
  activeSessionId?: number;
  files?: { name: string; url: string; id: number }[];
}
