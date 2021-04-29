import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectRoleResponse } from 'back/src/models/responses/project-role.response';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.less'],
})
export class EditRolesComponent implements OnInit {
  public roles: ProjectRoleResponse[];
  public permissions: string[];
  public createRoleForm: FormGroup;
  public get permissionsArray(): FormGroup[] {
    return (this.createRoleForm.get('permissions') as FormArray).controls as FormGroup[];
  }
  private projectId: number;
  public editingRole: ProjectRoleResponse | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private fb: FormBuilder,
  ) {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.projectId = params.id;
      this.getProjectRoles(this.projectId);
    });
    this.createRoleForm = this.fb.group({
      name: [null, Validators.required],
      permissions: this.fb.array([]),
    });
  }

  public ngOnInit(): void {
    // eslint-disable-next-line no-restricted-globals
    this.permissions = Object.values(Permissions).filter((v) => isNaN(parseInt(v as string, 10)));
    const permissionsArray = this.createRoleForm.get('permissions') as FormArray;
    permissionsArray.clear();

    this.permissions.forEach((permission) => {
      permissionsArray.push(
        this.fb.group({
          name: permission,
          id: Permissions[permission],
          isChecked: this.editingRole
            ? !!this.editingRole.permissionIds.find((id) => id === Permissions[permission])
            : false,
        }),
      );
    });
  }

  public onRoleClick(role?: ProjectRoleResponse) {
    this.editingRole = role;
    if (!this.editingRole) {
      return;
    }
    const formValue = this.createRoleForm.getRawValue();

    this.createRoleForm.patchValue({
      name: this.editingRole.name,
      permissions: formValue.permissions.map((perm: any) => ({
        ...perm,
        isChecked: !!this.editingRole?.permissionIds.find((id) => id === perm.id),
      })),
    });
  }

  public saveRole() {
    if (this.createRoleForm.invalid) {
      this.createRoleForm.markAllAsTouched();
      return;
    }

    const formValue = this.createRoleForm.getRawValue();
    this.getRequest(formValue).subscribe(() => {
      this.resetForm();
      this.getProjectRoles(this.projectId);
      this.onRoleClick();
    });
  }

  private getRequest(formValue: any) {
    const permissionIds = formValue.permissions
      .filter((perm: any) => perm.isChecked)
      .map((perm: any) => perm.id);
    if (this.editingRole) {
      return this.projectService.editProjectRole(this.projectId, {
        projectRoleId: this.editingRole.id,
        projectRoleName: formValue.name,
        permissionIds,
      });
    }

    return this.projectService.addProjectRole(this.projectId, {
      roleName: formValue.name,
      permissionIds,
    });
  }

  public removeRole(roleId: number) {
    this.projectService.removeProjectRole(this.projectId, roleId).subscribe(() => {
      this.resetForm();
      this.onRoleClick();
      this.getProjectRoles(this.projectId);
    });
  }

  private getProjectRoles(projectId: number) {
    this.projectService.getProjectRoles(projectId).subscribe((roles) => {
      this.roles = roles;
    });
  }

  private resetForm() {
    const formValue = this.createRoleForm.getRawValue();
    this.createRoleForm.patchValue({
      name: '',
      permissions: formValue.permissions.map((perm: any) => ({ ...perm, isChecked: false })),
    });
    this.createRoleForm.markAsUntouched();
    this.createRoleForm.markAsPending({ emitEvent: false });
  }
}
