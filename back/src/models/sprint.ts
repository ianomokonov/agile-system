import { TaskShortView } from './responses/task-short-view';

export interface Sprint {
  id: number;
  name: string;
  goal?: string;
  isActive: boolean;
  projectId: number;
  dateStart?: Date;
  dateEnd?: Date;

  tasks: TaskShortView[];
}
