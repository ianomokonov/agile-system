import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { priorities, taskTypes, userSearchFn } from 'src/app/utils/constants';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';
import { IdNameResponse } from 'back/src/models/responses/id-name.response';
import { TaskType } from 'back/src/models/task-type';
import { Priority } from 'back/src/models/priority';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.less'],
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  private rxAlive = true;
  public users: UserShortView[] = [];
  public editor = ClassicEditor;
  public createForm: FormGroup;
  public taskTypes = taskTypes;
  public userSearchFn = userSearchFn;
  public priorities = priorities;
  public sprints: IdNameResponse[] = [];
  constructor(
    private modal: NgbActiveModal,
    private fb: FormBuilder,
    private projectDataService: ProjectDataService,
    private projectService: ProjectService,
  ) {
    this.createForm = fb.group({
      name: [null, [Validators.required, Validators.maxLength(255)]],
      description: [null, Validators.required],
      projectUserId: [null],
      typeId: [TaskType.Feature, Validators.required],
      projectSprintId: [null],
      priorityId: [Priority.Low, Validators.required],
    });
  }

  public ngOnInit() {
    this.projectService
      .getProjectSprints(this.projectDataService.project?.id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((sprints) => {
        this.sprints = sprints;
      });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public assignToMe() {
    this.createForm.patchValue({
      projectUserId: this.users.find((u) => u.isMy)?.id,
    });
  }

  public dismiss() {
    this.modal.dismiss();
  }

  public close() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.modal.close(this.createForm.getRawValue());
  }
}
