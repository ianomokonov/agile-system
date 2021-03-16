import { Link } from './link';

export interface Project {
  id: number;
  name: string;
  links: Link[];
  users: { id: number }[];
  repository: string;
  description: string;
  isClosed: boolean;
  lastEditDate: Date;
}
