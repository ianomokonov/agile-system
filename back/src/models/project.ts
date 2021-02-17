import { Link } from './link';

export interface Project {
  name: string;
  links: Link[];
  users: { id: number }[];
  repository: string;
  description: string;
  isClosed: boolean;
  ownerId: number;
}
