import { TaskResponse } from './task.response';

export interface Planning {
  id: number;
  isActive: boolean;
  createDate: Date;
  sprintId: number;
  activeSprintId: number;
  sprintName: string;
  activeStep: PlanningStep;
  activeTaskId: number;
}

export interface PlanningFullView extends Planning {
  newTasks: TaskResponse[];
  notMarkedTasks: TaskResponse[];
}

export enum PlanningStep {
  NewTasks = 1,
  MarkTasks,
}
