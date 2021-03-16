import { UserShortView } from './user-short-view';

export interface ProjectEditInfo {
  name: string;
  repository: string;
  description: string;
  users: UserShortView[];
}
