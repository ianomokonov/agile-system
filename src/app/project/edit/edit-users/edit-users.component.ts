import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectRoleResponse } from 'back/src/models/responses/project-role.response';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { concat, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.less'],
})
export class EditUsersComponent {
  private projectId: number;
  public projectUsers: UserShortView[];
  public searchedUsers$: Observable<UserShortView[]>;
  public editingUser: UserShortView | undefined;
  public userForm: FormGroup;
  public roles: ProjectRoleResponse[];
  public searchUser$: Subject<string> = new Subject();
  public allUsersIncluded = true;
  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.projectId = params.id;
      this.getProjectInfo();
    });
    this.userForm = this.fb.group({
      user: [null, Validators.required],
      roleIds: [
        null,
        (formControl: FormControl) => {
          if (!formControl.value?.length) {
            return { invalidArray: true };
          }
          return null;
        },
      ],
    });

    this.searchedUsers$ = concat(
      of([]), // default items
      this.searchUser$.pipe(
        debounceTime(200),
        switchMap((term) => {
          return this.getUsers(term).pipe(catchError(() => of([])));
        }),
      ),
    );
  }

  public onSelectSearch({ term }: any) {
    this.searchUser$.next(term);
  }

  public onUserClick(user?: UserShortView) {
    this.editingUser = user;
    if (!this.editingUser) {
      this.userForm.reset();
      return;
    }
    this.userForm.patchValue({
      user: this.editingUser,
      roleIds: this.editingUser.roleIds,
    });
  }

  public removeUser(userId: number) {
    this.projectService.removeProjectUser(this.projectId, userId).subscribe(() => {
      this.onUserClick();
      this.getProjectInfo();
    });
  }

  public saveProjectUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();
    this.getRequest(formValue).subscribe(
      () => {
        this.onUserClick();
        this.getProjectInfo();
      },
      () => {
        this.onUserClick();
      },
    );
  }

  private getRequest(formValue: any) {
    if (this.editingUser) {
      return this.projectService.editProjectUser(this.projectId, {
        projectUserId: this.editingUser.id,
        roleIds: formValue.roleIds,
      });
    }

    return this.projectService.addProjectUser(this.projectId, {
      projectId: this.projectId,
      userId: formValue.user.id,
      roleIds: formValue.roleIds,
    });
  }

  private getProjectInfo() {
    forkJoin([
      this.projectService.getProjectUsers(this.projectId),
      this.projectService.getProjectRoles(this.projectId),
    ]).subscribe(([projectUsers, roles]) => {
      this.projectUsers = projectUsers;
      this.roles = roles;

      this.getUsers('').subscribe((users) => {
        this.searchedUsers$ = of(users);
      });
    });
  }

  private getUsers(term: string): Observable<UserShortView[]> {
    return this.userService.getUsers(term).pipe(
      map((users) => {
        const filtered = users.filter(
          (user) => !this.projectUsers.find((pUser) => pUser.email === user.email),
        );
        if (!filtered.length) {
          this.allUsersIncluded = true;
        } else {
          this.allUsersIncluded = false;
        }
        return filtered;
      }),
    );
  }
}
