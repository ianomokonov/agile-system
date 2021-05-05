import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Priority } from 'back/src/models/priority';
import { IdNameResponse } from 'back/src/models/responses/id-name.response';
import { ProjectEpicResponse } from 'back/src/models/responses/project-epic.response';
import { StatusResponse } from 'back/src/models/responses/status.response';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { TaskType } from 'back/src/models/task-type';
import { priorities, taskTypes } from 'src/app/utils/constants';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.less'],
})
export class EditTaskComponent {
  public editForm: FormGroup;
  public priorities = priorities;
  public taskTypes = taskTypes;
  public statuses: StatusResponse[] = [];
  public sprints: IdNameResponse[] = [];
  public epics: ProjectEpicResponse[] = [];
  public set task(task: TaskResponse) {
    this.editForm.patchValue({
      typeId: task.typeId,
      projectSprintId: task.sprint?.id,
      epicId: task.epic?.id,
      priorityId: task.priorityId,
      statusId: task.status.id,
    });
  }
  constructor(private modal: NgbActiveModal, private fb: FormBuilder) {
    this.editForm = fb.group({
      typeId: [TaskType.Feature, Validators.required],
      projectSprintId: [null],
      epicId: [null],
      priorityId: [Priority.Low, Validators.required],
      statusId: [0, Validators.required],
    });
  }

  public dismiss() {
    this.modal.dismiss();
  }

  public close() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.modal.close(this.editForm.getRawValue());
  }
}
