import { Sprint } from '../sprint';
import { StatusResponse } from './status.response';
import { UserShortView } from './user-short-view';

export interface ProjectResponse {
  id: number;
  name: string;
  repository: string;
  description: string;
  isClosed: boolean;
  sprint: Sprint;
  activePlanningId?: number;
  activeRetroId?: number;
  activeDemoId?: number;
  statuses: StatusResponse[];
  users: UserShortView[];
}
