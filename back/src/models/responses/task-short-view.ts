import { UserShortView } from './user-short-view';

export interface TaskShortView {
  id: string;
  name: string;
  description: string;
  statusId: number;
  createDate: Date;
  user: UserShortView;
}
