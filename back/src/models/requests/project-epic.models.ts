export interface CreateProjectEpicRequest {
  projectId?: number;
  name: string;
  description: string;
  color: string;
}

export interface UpdateProjectEpicRequest {
  epicId: number;
  name: string;
  description: string;
  color: string;
}
