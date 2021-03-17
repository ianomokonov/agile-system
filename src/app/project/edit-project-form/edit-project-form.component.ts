import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { Tag } from 'src/app/shared/tags-input/tags-input.component';

@Component({
  selector: 'app-edit-project-form',
  templateUrl: './edit-project-form.component.html',
  styleUrls: ['./edit-project-form.component.less'],
})
export class EditProjectFormComponent implements OnInit {
  public formGroup: FormGroup;
  public search$: Subject<string> = new Subject();
  public users: (UserShortView & Tag)[] = [];
  public projectId: number;

  constructor(
    private fb: FormBuilder,
    private usersService: UserService,
    private projectService: ProjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.formGroup = fb.group({
      name: [null, Validators.required],
      repository: null,
      description: [null, Validators.required],
      users: null,
    });
    this.search$.pipe(debounceTime(200)).subscribe((value) => {
      this.onUsersSearch(value);
    });
  }

  public ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.getProjectInfo(params.id);
    });
    this.search$.next('');
  }

  public getProjectInfo(projectId: number) {
    this.projectService.getProjectEditInfo(projectId).subscribe((project) => {
      this.formGroup.patchValue({ ...project, users: this.getUsers(project.users) });
      this.projectId = projectId;
    });
  }

  public onUsersSearch(searchString: string) {
    this.usersService.getUsers(searchString).subscribe((users) => {
      this.users = this.getUsers(users);
    });
  }

  private getUsers(users: UserShortView[]) {
    return users.map((user) => {
      return {
        ...user,
        key: user.email,
      };
    });
  }

  public createProject() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const formValue = this.formGroup.getRawValue();

    this.getRequest(formValue).subscribe((projectId) => {
      this.router.navigate(['/project', this.projectId || projectId]);
    });
  }

  private getRequest(formValue: any) {
    const request = {
      name: formValue.name,
      description: formValue.description,
      repository: formValue.repository,
      usersIds: formValue.users.map((user: UserShortView & Tag) => user.id),
      links: [],
    };

    if (this.projectId) {
      return this.projectService.updateProject(this.projectId, request);
    }
    return this.projectService.createProject(request);
  }
}
