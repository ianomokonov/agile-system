import { TaskShortView } from './task-short-view';

export interface ProjectResponse {
  name: string;
  repository: string;
  description: string;
  isClosed: boolean;
  tasks: TaskShortView[];
}
