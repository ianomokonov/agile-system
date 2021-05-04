import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { takeWhile } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { Tag } from 'src/app/shared/tags-input/tags-input.component';
import { editorConfig } from 'src/app/utils/constants';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-edit-project-form',
  templateUrl: './edit-project-form.component.html',
  styleUrls: ['./edit-project-form.component.less'],
})
export class EditProjectFormComponent implements OnInit, OnDestroy {
  private rxAlive = true;
  public formGroup: FormGroup;
  public users: (UserShortView & Tag)[] = [];
  public projectId: number;
  public editor = ClassicEditor;
  public editorConfig = editorConfig;

  constructor(
    private fb: FormBuilder,
    private usersService: UserService,
    private projectService: ProjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.formGroup = fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  public ngOnInit() {
    this.activatedRoute.parent?.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      if (params.id) {
        this.getProjectInfo(params.id);
      }
    });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public getProjectInfo(projectId: number) {
    this.projectService
      .getProjectEditInfo(projectId)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((project) => {
        this.formGroup.patchValue(project);
        this.projectId = projectId;
      });
  }

  public createProject() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const formValue = this.formGroup.getRawValue();

    this.getRequest(formValue)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((projectId) => {
        if (!this.projectId) {
          this.router.navigate(['/project', projectId, 'backlog']);
        }
      });
  }

  private getRequest(formValue: any) {
    const request = {
      name: formValue.name,
      description: formValue.description,
    };

    if (this.projectId) {
      return this.projectService.updateProject(this.projectId, request);
    }
    return this.projectService.createProject(request);
  }
}
