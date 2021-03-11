export interface CreateTaskRequest {
  projectId: number;
  name: string;
  description: string;
  projectUserId?: number;
}

export interface UpdateTaskRequest {
  id: number;
  name: string;
  description: string;
  projectUserId?: number;
}
