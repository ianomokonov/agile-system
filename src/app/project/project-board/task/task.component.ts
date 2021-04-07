import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { TaskService } from 'src/app/services/task.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectResponse } from 'back/src/models/responses/project.response';
import { IdNameResponse } from 'back/src/models/responses/id-name.response';
import { forkJoin } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { EditTaskComponent } from './edit-task/edit-task.component';

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
  public sprints: IdNameResponse[] = [];
  public project: ProjectResponse;
  public descriptionControl: FormControl = new FormControl();
  public userControl: FormControl = new FormControl();
  public nameControl: FormControl = new FormControl(null, Validators.required);
  constructor(
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private location: Location,
    private modalService: NgbModal,
    private projectDataService: ProjectDataService,
    private projectService: ProjectService,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.getTaskInfo(params.id, true);
    });

    this.userControl.valueChanges.subscribe((userId) => {
      this.taskService
        .editTask(this.task.id, {
          projectUserId: userId,
        })
        .subscribe(() => {
          this.userControl.markAsPristine();
        });
    });
  }

  private getTaskInfo(id: number, getProject = false) {
    this.editingDescription = false;
    this.editingName = false;
    this.taskService.getTask(id).subscribe((task) => {
      if (getProject) {
        forkJoin([
          this.projectDataService.getProject(task.projectId),
          this.projectService.getProjectSprints(task.projectId),
        ]).subscribe(([project, sprints]) => {
          this.project = project;
          this.sprints = sprints;
        });
      }
      this.task = task;
      this.descriptionControl.setValue(task.description);
      this.nameControl.setValue(task.name);
      this.userControl.setValue(task.projectUser?.id, { emitEvent: false });
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

  public editTaskInfo() {
    const modal = this.modalService.open(EditTaskComponent);
    modal.componentInstance.statuses = this.project.statuses;
    modal.componentInstance.sprints = this.sprints;
    modal.componentInstance.task = this.task;
    modal.result
      .then((result) => {
        this.taskService.editTask(this.task.id, result).subscribe(() => {
          this.getTaskInfo(this.task.id);
        });
      })
      .catch(() => {});
  }
}
