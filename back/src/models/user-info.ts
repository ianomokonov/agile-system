import { Project } from './project';

export interface UserInfo {
  name?: string;
  surname?: string;
  email?: string;
  vk?: string;
  gitHub?: string;
  projects?: Project[];
}
