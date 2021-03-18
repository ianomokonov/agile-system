import { StatusResponse } from './status.response';
import { TaskShortView } from './task-short-view';

export interface ProjectResponse {
  id: number;
  name: string;
  repository: string;
  description: string;
  isClosed: boolean;
  tasks: TaskShortView[];
  statuses: StatusResponse[];
}
