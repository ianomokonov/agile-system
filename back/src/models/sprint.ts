import { TaskShortView } from './responses/task-short-view';

export interface Sprint {
  id: number;
  name: string;
  goal?: string;
  isActive: boolean;
  isFinished: boolean;
  projectId: number;
  startDate?: Date;
  endDate?: Date;
  isOpened?: boolean;
  planningId?: number;
  demo: { id: number; isFinished: number };

  tasks: TaskShortView[];
}
