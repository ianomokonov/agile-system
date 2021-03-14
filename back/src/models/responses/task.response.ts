export interface TaskResponse {
  name: string;
  description: string;
  statusId: number;
  typeId: number;
  epicId: number;
  parentId: number;
  projectUserId: number;
  points: number;
  projectId: number;
  lastEditDate: Date;
  createDate: Date;
  projectSprintId: number;
}
