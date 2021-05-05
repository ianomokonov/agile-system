import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemoService } from 'src/app/services/demo.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/services/project.service';
import { TaskType } from 'back/src/models/task-type';
import { Priority } from 'back/src/models/priority';
import { forkJoin } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { takeWhile } from 'rxjs/operators';
import { TaskService } from 'src/app/services/task.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { Permissions } from 'back/src/models/permissions';
import { getTaskFiles } from 'src/app/utils/constants';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less'],
})
export class DemoComponent implements OnInit, OnDestroy {
  private rxAlive = true;
  private projectId: number;
  public demo;
  public activeTask: any;
  public activeTab = 1;
  public editor = ClassicEditor;
  public permissions = Permissions;
  public getTaskFiles = getTaskFiles;
  public demoTaskForm: FormGroup;
  public get commentControl(): FormControl {
    return this.demoTaskForm.get('comment') as FormControl;
  }
  public get filesControl(): FormControl {
    return this.demoTaskForm.get('files') as FormControl;
  }
  private readonly commentKey = 'DemoCommentKey';
  constructor(
    private activatedRoute: ActivatedRoute,
    private demoService: DemoService,
    private router: Router,
    public modalService: NgbModal,
    private fb: FormBuilder,
    private projectService: ProjectService,
    public projectDataService: ProjectDataService,
    private socketService: SocketService,
    private cdRef: ChangeDetectorRef,
    private taskService: TaskService,
  ) {
    this.demoTaskForm = this.fb.group({
      name: [`Замечания с демо от ${new Date().toLocaleDateString()}`, Validators.required],
      comment: [null],
      files: null,
    });
    this.commentControl.valueChanges.pipe(takeWhile(() => this.rxAlive)).subscribe((value) => {
      sessionStorage.setItem(this.commentKey, value);
    });
  }

  public downloadFile(file) {
    this.taskService.downloadFile(this.activeTask.task.id, file.id).subscribe();
  }

  public canAcceptTask() {
    if (!this.activeTask || !this.activeTask.task.criteria?.length) {
      return true;
    }

    return !this.activeTask.task.criteria.some((c) => !c.isDone);
  }

  public saveDoneCriteria(criteria) {
    this.socketService.acceptDemoTaskCriteria(this.projectId, criteria.id, {
      isDone: !!criteria.isDone,
    });
  }

  public ngOnInit(): void {
    this.socketService
      .of('acceptDemoTaskCriteria')
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(({ isDone, criteriaId }) => {
        const criteria = this.activeTask.task.criteria?.find((c) => c.id === criteriaId);
        if (criteria) {
          criteria.isDone = isDone;
        }
      });
    this.socketService
      .onFinishDemo()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        sessionStorage.removeItem(this.commentKey);
        this.dismiss();
        this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
      });
    this.socketService
      .onAcceptDemoTask()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((taskId) => {
        this.onFinishTask(taskId);
      });
    this.socketService
      .of('reopenDemoTask')
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.getDemo(this.demo?.id);
      });
    if (sessionStorage.getItem(this.commentKey)) {
      this.commentControl.setValue(sessionStorage.getItem(this.commentKey), { emitEvent: false });
    }
    this.activatedRoute.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      if (params.demoId) {
        this.projectId = params.id;
        this.getDemo(params.demoId);
      }
    });
    this.activatedRoute.queryParams.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      if (params.demoTaskId && this.demo) {
        this.setActiveTask(params.demoTaskId);
      }
    });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }
  public onFinishTask(taskId) {
    const taskIndex = this.demo.taskToShow?.findIndex((t) => t.id === taskId);
    if ((taskIndex || taskIndex === 0) && taskIndex > -1) {
      this.demo.taskToShow[taskIndex].isFinished = true;
      this.demo.shownTasks.unshift(this.demo.taskToShow[taskIndex]);
      this.demo.taskToShow.splice(taskIndex, 1);
    }
  }

  public onTaskClick(demoTaskId) {
    this.router.navigate([], {
      queryParams: { demoTaskId },
      relativeTo: this.activatedRoute,
    });
  }

  public acceptTask(demoTaskId) {
    if (!this.activeTask) {
      return;
    }
    if (this.demo.taskToShow.length !== 1) {
      this.onTaskClick(this.demo.taskToShow.find((t) => t.id !== demoTaskId).id);
    }
    this.socketService.acceptDemoTask(this.projectId, demoTaskId);
  }

  public reopenTask(demoTaskId) {
    if (!this.activeTask) {
      return;
    }
    if (this.demo.taskToShow.length !== 1) {
      this.onTaskClick(this.demo.taskToShow.find((t) => t.id !== demoTaskId).id);
    }
    this.socketService.reopenDemoTask(this.projectId, demoTaskId);
  }

  public openNotes(template) {
    this.modalService.open(template);
  }

  public finishDemoWithoutTask() {
    this.socketService.finishDemo(this.projectId);
  }

  // eslint-disable-next-line complexity
  public finishDemo(createTask = false, template?) {
    if (!createTask && (this.commentControl.value || this.filesControl.value) && template) {
      this.commentControl.setValidators(Validators.required);
      this.demoTaskForm.updateValueAndValidity();
      this.cdRef.detectChanges();
      this.modalService.open(template);
      return;
    }

    const subscriptions: any[] = [];

    if (createTask) {
      if (this.demoTaskForm.invalid) {
        this.demoTaskForm.markAllAsTouched();
        return;
      }
      const formValue = this.demoTaskForm.getRawValue();
      subscriptions.push(
        this.taskService.addTask(this.projectId, {
          name: formValue.name,
          description: formValue.comment,
          projectSprintId: this.demo.sprintId,
          typeId: TaskType.Bug,
          priorityId: Priority.Critical,
          files: formValue.files,
        }),
      );
    }

    if (subscriptions.length) {
      forkJoin(subscriptions)
        .pipe(takeWhile(() => this.rxAlive))
        .subscribe(() => {
          this.dismiss();
          this.socketService.finishDemo(this.projectId);
        });
      return;
    }
    this.socketService.finishDemo(this.projectId);
  }

  public dismiss() {
    this.modalService.dismissAll();
    this.commentControl.clearValidators();
    this.demoTaskForm.updateValueAndValidity();
  }

  private getDemo(id: number) {
    this.demoService
      .read(this.projectId, id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((demo) => {
        if (demo.isFinished || (!demo.taskToShow?.length && !demo.shownTasks?.length)) {
          this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
          return;
        }
        this.demo = demo;
        this.socketService.enterDemoRoom(this.projectId, demo.id);

        if (this.activatedRoute.snapshot.queryParams.demoTaskId) {
          this.setActiveTask(this.activatedRoute.snapshot.queryParams.demoTaskId);
          return;
        }
        this.onTaskClick(this.demo.taskToShow[0]?.id || this.demo.shownTasks[0]?.id);
      });
  }

  private setActiveTask(demoTaskId) {
    this.activeTask =
      this.demo.taskToShow?.find((task) => task.id === +demoTaskId) ||
      this.demo.shownTasks?.find((task) => task.id === +demoTaskId);
    if (!this.activeTask.task.comments?.length) {
      this.activeTab = 1;
    }
    if (!this.activeTask.task.criteria?.length) {
      this.activeTab = 2;
    }
  }
}
