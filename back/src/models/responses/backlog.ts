import { Sprint } from '../sprint';
import { TaskShortView } from './task-short-view';

export interface Backlog {
  sprints: Sprint[];
  tasks: TaskShortView[];
}
