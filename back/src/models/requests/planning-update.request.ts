import { PlanningStep } from '../responses/planning';

export interface PlanningUpdateRequest {
  activeStep?: PlanningStep;
  activeTaskId?: number;
}
