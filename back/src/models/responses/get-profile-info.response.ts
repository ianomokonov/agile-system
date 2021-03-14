import { Project } from '../project';
import { UserInfo } from '../user-info';

export interface GetProfileInfoResponse extends UserInfo {
  email?: string;
  projects: Project[];
}
