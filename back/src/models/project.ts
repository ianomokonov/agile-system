export interface Project {
  name: string;
  roles: string[];
  repository: string;
  description: string;
  isClosed: boolean;
  ownerId: number;
}
