export interface CreateProjectRoleRequest {
  projectId?: number;
  roleName: string;
  permissionIds: number[];
}

export interface UpdateProjectRoleRequest {
  projectRoleId: number;
  projectRoleName: string;
  permissionIds: number[];
}
