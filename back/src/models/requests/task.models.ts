export interface CreateTaskRequest {
  projectId?: number;
  name: string;
  description: string;
  projectUserId?: number;
  creatorId?: number;
}

export interface UpdateTaskRequest {
  id: number;
  name: string;
  description: string;
  projectUserId?: number;
  userId?: number;
  projectId?: number;
}
