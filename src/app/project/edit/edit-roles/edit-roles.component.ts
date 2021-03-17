import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectPermissionResponse } from 'back/src/models/responses/permission.response';
import { ProjectRoleResponse } from 'back/src/models/responses/project-role.response';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.less'],
})
export class EditRolesComponent implements OnInit {
  public roles: ProjectRoleResponse[];
  public permissions: ProjectPermissionResponse[];
  public createRoleForm: FormGroup;
  public get permissionsArray(): FormGroup[] {
    return (this.createRoleForm.get('permissions') as FormArray).controls as FormGroup[];
  }
  private editingRole: ProjectRoleResponse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private fb: FormBuilder,
  ) {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.getProjectRoles(params.id);
    });
    this.createRoleForm = this.fb.group({
      name: [null, Validators.required],
      permissions: this.fb.array([]),
    });
  }

  public ngOnInit(): void {
    this.projectService.getPermissions().subscribe((permissions) => {
      this.permissions = permissions;
      const permissionsArray = this.createRoleForm.get('permissions') as FormArray;
      permissionsArray.clear();

      this.permissions.forEach((permission) => {
        permissionsArray.push(
          this.fb.group({
            name: permission.name,
            id: permission.id,
            isChecked: this.editingRole
              ? !!this.editingRole.permissionIds.find((id) => id === permission.id)
              : false,
          }),
        );
      });
    });
  }

  private getProjectRoles(projectId: number) {
    this.projectService.getProjectRoles(projectId).subscribe((roles) => {
      this.roles = roles;
    });
  }
}
