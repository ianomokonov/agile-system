import { Component, OnDestroy, OnInit } from '@angular/core';
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
  public editor = ClassicEditor;
  public demoTaskForm: FormGroup;
  public get commentControl(): FormControl {
    return this.demoTaskForm.get('comment') as FormControl;
  }
  private readonly commentKey = 'DemoCommentKey';
  constructor(
    private activatedRoute: ActivatedRoute,
    private demoService: DemoService,
    private router: Router,
    public modalService: NgbModal,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private socketService: SocketService,
  ) {
    this.demoTaskForm = this.fb.group({
      name: [null, Validators.required],
      comment: [null],
    });
    this.commentControl.valueChanges.pipe(takeWhile(() => this.rxAlive)).subscribe((value) => {
      sessionStorage.setItem(this.commentKey, value);
    });
  }

  public ngOnInit(): void {
    this.socketService
      .onFinishDemo()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        sessionStorage.removeItem(this.commentKey);
        this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
      });
    this.socketService
      .onAcceptDemoTask()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((taskId) => {
        const taskIndex = this.demo.taskToShow?.findIndex((t) => t.id === taskId);
        if ((taskIndex || taskIndex === 0) && taskIndex > -1) {
          this.demo.taskToShow[taskIndex].isFinished = true;
          this.demo.shownTasks.unshift(this.demo.taskToShow[taskIndex]);
          this.demo.taskToShow.splice(taskIndex, 1);
        }
      });
    this.socketService
      .onActiveDemoTask()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((demoTaskId) => {
        this.router.navigate([], {
          queryParams: { demoTaskId },
          relativeTo: this.activatedRoute,
        });
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

  public onTaskClick(demoTaskId) {
    this.socketService.activeDemoTask(demoTaskId);
  }

  public acceptTask(demoTaskId) {
    if (!this.activeTask) {
      return;
    }
    if (this.demo.taskToShow.length !== 1) {
      this.onTaskClick(this.demo.taskToShow.find((t) => t.id !== demoTaskId).id);
    }
    this.socketService.acceptDemoTask(demoTaskId);
  }

  public finishDemo(createTask = false, template?) {
    if (!createTask && this.commentControl.value && template) {
      this.commentControl.setValidators(Validators.required);
      this.demoTaskForm.patchValue({
        name: `Замечания с демо от ${new Date().toLocaleDateString()}`,
      });
      this.modalService.open(template);
      return;
    }

    const subscriptions: any[] = [];

    if (createTask) {
      const formValue = this.demoTaskForm.getRawValue();
      subscriptions.push(
        this.projectService.addTask(this.projectId, {
          name: formValue.name,
          description: formValue.comment,
          projectSprintId: this.demo.sprintId,
          typeId: TaskType.Bug,
          priorityId: Priority.Critical,
        }),
      );
    }

    if (subscriptions.length) {
      forkJoin(subscriptions)
        .pipe(takeWhile(() => this.rxAlive))
        .subscribe(() => {
          this.dismiss();
          this.socketService.finishDemo();
        });
      return;
    }
    this.socketService.finishDemo();
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
        this.socketService.enterDemoRoom(demo.id);

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
  }
}
