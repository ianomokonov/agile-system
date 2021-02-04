import { link } from "./link";

export interface Project {
  name: string;
  roles: string[];
  links: link[],
  users: { id: number, roles: string[] }[],
  repository: string;
  description: string;
  isClosed: boolean;
  ownerId: number;
}
