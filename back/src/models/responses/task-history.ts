import { IdNameResponse } from './id-name.response';
import { StatusResponse } from './status.response';
import { UserShortView } from './user-short-view';

export interface TaskHistory {
  id: number;
  fieldName: string;
  newValue: string;
  createDate: Date;
  userName: string;
  userSurname: string;
  user?: UserShortView;
  sprint?: IdNameResponse;
  status?: StatusResponse;
}
