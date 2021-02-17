import { Link } from './link';

export interface CreateProjectRequest {
  name: string;
  links: Link[];
  usersIds: number[];
  repository: string;
  description: string;
}
