import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { takeWhile } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';
import { editorConfig, taskFields, userSearchFn } from 'src/app/utils/constants';
import { UploadFile } from 'src/app/shared/multiple-file-uploader/multiple-file-uploader.component';
import { TaskTypePipe } from 'src/app/shared/pipes/task-type.pipe';
import { PriorityPipe } from 'src/app/shared/pipes/priority.pipe';
import { Permissions } from 'back/src/models/permissions';
import { EditTaskComponent } from './edit-task/edit-task.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less'],
})
export class TaskComponent implements OnDestroy {
  private rxAlive = true;
  public task: TaskResponse;
  public editor = ClassicEditor;
  public editorConfig = editorConfig;
  public permissions = Permissions;
  public editingDescription = false;
  public editingName = false;
  public sprints: IdNameResponse[] = [];
  public userSerachFn = userSearchFn;

  public project: ProjectResponse;
  public descriptionControl: FormControl = new FormControl();
  public userControl: FormControl = new FormControl();
  public filesControl: FormControl = new FormControl();
  public nameControl: FormControl = new FormControl(null, Validators.required);
  @ViewChild('inputFileContainer') private inputFileContainer: ElementRef<HTMLDivElement>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private location: Location,
    private modalService: NgbModal,
    public projectDataService: ProjectDataService,
    private projectService: ProjectService,
    private taskTypePipe: TaskTypePipe,
    private priorityPipe: PriorityPipe,
  ) {
    this.activatedRoute.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      this.getTaskInfo(params.id, true);
    });

    this.userControl.valueChanges.pipe(takeWhile(() => this.rxAlive)).subscribe((userId) => {
      this.taskService
        .editTask(this.task.id, {
          projectUserId: userId,
        })
        .pipe(takeWhile(() => this.rxAlive))
        .subscribe(() => {
          this.userControl.markAsPristine();
        });
    });
    this.filesControl.valueChanges.subscribe((files: UploadFile[]) => {
      const notUploudedFiles = files.filter((file) => !!file.file);
      if (notUploudedFiles?.length) {
        this.uploadFiles(notUploudedFiles.map((file) => file.file || null));
      }
    });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  private getTaskInfo(id: number, getProject = false) {
    this.editingDescription = false;
    this.editingName = false;
    this.taskService
      .getTask(id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((task) => {
        if (getProject) {
          forkJoin([
            this.projectDataService.getProject(task.projectId),
            this.projectService.getProjectSprints(task.projectId),
          ])
            .pipe(takeWhile(() => this.rxAlive))
            .subscribe(([project, sprints]) => {
              this.project = project;
              this.sprints = sprints;
            });
        }
        this.task = task;
        this.descriptionControl.setValue(task.description);
        this.nameControl.setValue(task.name);
        this.filesControl.setValue(
          task.files?.map((file) => ({
            id: file.id,
            name: file.name,
            url: file.url,
          })) as UploadFile[],
          { emitEvent: false },
        );
        this.userControl.setValue(task.projectUser?.id, { emitEvent: false });
      });
  }
  public getHistoryField(item) {
    return taskFields[item.fieldName] || item.fieldName;
  }
  // eslint-disable-next-line complexity
  public getHistoryValue(item) {
    if (item.fieldName === 'projectUserId') {
      return item.user && `${item.user?.name} ${item.user?.surname}`;
    }
    if (item.fieldName === 'projecSprintId') {
      return item.sprint?.name;
    }
    if (item.fieldName === 'statusId') {
      return item.status?.name;
    }
    if (item.fieldName === 'typeId') {
      return this.taskTypePipe.transform(item.newValue);
    }
    if (item.fieldName === 'priorityId') {
      return this.priorityPipe.transform(item.newValue);
    }
    return item.newValue;
  }
  public saveTaskDescription() {
    this.taskService
      .editTask(this.task.id, {
        description: this.descriptionControl.value,
      })
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.getTaskInfo(this.task.id);
      });
  }

  public downloadFile(file) {
    this.taskService
      .downloadFile(this.task.id, file.id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe();
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
      .pipe(takeWhile(() => this.rxAlive))
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
      .pipe(takeWhile(() => this.rxAlive))
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
        this.taskService
          .editTask(this.task.id, result)
          .pipe(takeWhile(() => this.rxAlive))
          .subscribe(() => {
            this.getTaskInfo(this.task.id);
          });
      })
      .catch(() => {});
  }

  public deleteTask() {
    if (!confirm('Вы действительно хотитет удалить задачу?')) return;
    this.taskService
      .removeTask(this.task.id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.router.navigate([`/project/${this.projectDataService.project.id}`]);
      });
  }

  public removeFile({ id: fileId }: UploadFile) {
    this.taskService
      .removeFile(this.task.id, fileId)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.getTaskInfo(this.task.id);
      });
  }

  private uploadFiles(files: (File | null)[]) {
    const fromData = new FormData();
    files.forEach((file) => {
      if (file) {
        fromData.append('files', file);
      }
    });

    this.taskService
      .uploadFiles(this.task.id, fromData)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.getTaskInfo(this.task.id);
      });
  }
}
