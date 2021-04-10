import { TaskResponse } from './task.response';

export interface Planning {
  id: number;
  isActive: boolean;
  createDate: Date;
  sprintId: number;
  activeSprintId: number;
  sprintName: string;
  activeStep: PlanningStep;
  activeSessions: any[];
}

export interface PlanningFullView extends Planning {
  newTasks: TaskResponse[];
  notMarkedTasks: TaskResponse[];
  completedSessions: any[];
}

export enum PlanningStep {
  NewTasks = 1,
  MarkTasks,
}
