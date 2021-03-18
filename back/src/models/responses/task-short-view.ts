import { UserShortView } from './user-short-view';

export interface TaskShortView {
  name: string;
  description: string;
  statusId: number;
  createDate: Date;
  user: UserShortView;
}
