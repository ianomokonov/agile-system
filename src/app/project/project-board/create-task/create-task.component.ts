import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.less'],
})
export class CreateTaskComponent implements OnInit {
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
      name: [null, Validators.required],
      description: [null, Validators.required],
      projectUserId: [null],
      typeId: [TaskType.Feature, Validators.required],
      projectSprintId: [null],
      priorityId: [Priority.Low, Validators.required],
      files: null,
    });
  }

  public ngOnInit() {
    this.projectService
      .getProjectSprints(this.projectDataService.project?.id)
      .subscribe((sprints) => {
        this.sprints = sprints;
      });
  }

  public patchValue(value) {
    this.createForm.patchValue(value);
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
