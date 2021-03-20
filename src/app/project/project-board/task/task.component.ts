import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { TaskService } from 'src/app/services/task.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less'],
})
export class TaskComponent {
  public task: TaskResponse;
  public editor = ClassicEditor;
  public editingDescription = false;
  public editingName = false;
  public descriptionControl: FormControl = new FormControl();
  public nameControl: FormControl = new FormControl(null, Validators.required);
  constructor(
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private location: Location,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.getTaskInfo(params.id);
    });
  }

  private getTaskInfo(id: number) {
    this.editingDescription = false;
    this.editingName = false;
    this.taskService.getTask(id).subscribe((task) => {
      this.task = task;
      this.descriptionControl.setValue(task.description);
      this.nameControl.setValue(task.name);
    });
  }

  public saveTaskDescription() {
    this.taskService
      .editTask(this.task.id, {
        description: this.descriptionControl.value,
      })
      .subscribe(() => {
        this.getTaskInfo(this.task.id);
      });
  }

  public saveTaskName() {
    if (this.nameControl.invalid) {
      this.nameControl.markAllAsTouched();
      return;
    }
    this.taskService
      .editTask(this.task.id, {
        name: this.nameControl.value,
      })
      .subscribe(() => {
        this.getTaskInfo(this.task.id);
      });
  }

  public setDeveloper() {
    this.taskService
      .editTask(this.task.id, {
        projectUserId: -1,
        projectId: this.task.projectId,
      })
      .subscribe(() => {
        this.getTaskInfo(this.task.id);
      });
  }

  public backClicked() {
    this.location.back();
  }

  public cancelNameEditing() {
    if (!this.task.name) {
      return;
    }
    this.editingName = false;
    this.nameControl.setValue(this.task.name);
  }
}
