import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemoService } from 'src/app/services/demo.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/services/project.service';
import { TaskType } from 'back/src/models/task-type';
import { Priority } from 'back/src/models/priority';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less'],
})
export class DemoComponent implements OnInit {
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
  ) {
    this.demoTaskForm = this.fb.group({
      name: [null, Validators.required],
      comment: [null],
    });
    this.commentControl.valueChanges.subscribe((value) => {
      sessionStorage.setItem(this.commentKey, value);
    });
  }

  public ngOnInit(): void {
    if (sessionStorage.getItem(this.commentKey)) {
      this.commentControl.setValue(sessionStorage.getItem(this.commentKey), { emitEvent: false });
    }
    this.activatedRoute.params.subscribe((params) => {
      if (params.demoId) {
        this.projectId = params.id;
        this.getDemo(params.demoId);
      }
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.demoTaskId && this.demo) {
        this.setActiveTask(params.demoTaskId);
      }
    });
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

    this.demoService.finishTask(this.projectId, demoTaskId).subscribe(() => {
      if (this.demo.taskToShow.length !== 1) {
        this.onTaskClick(this.demo.taskToShow.find((t) => t.id !== demoTaskId).id);
      }
      this.getDemo(this.demo.id);
    });
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

    const subscriptions: any[] = [this.demoService.finish(this.projectId, this.demo.id)];

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

    forkJoin(subscriptions).subscribe(() => {
      this.dismiss();
      sessionStorage.removeItem(this.commentKey);
      this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
    });
  }

  public dismiss() {
    this.modalService.dismissAll();
    this.commentControl.clearValidators();
    this.demoTaskForm.updateValueAndValidity();
  }

  private getDemo(id: number) {
    this.demoService.read(this.projectId, id).subscribe((demo) => {
      if (demo.isFinished) {
        this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
      }
      this.demo = demo;

      if (this.activatedRoute.snapshot.queryParams.demoTaskId) {
        this.setActiveTask(this.activatedRoute.snapshot.queryParams.demoTaskId);
      }
    });
  }

  private setActiveTask(demoTaskId) {
    this.activeTask =
      this.demo.taskToShow?.find((task) => task.id === +demoTaskId) ||
      this.demo.shownTasks?.find((task) => task.id === +demoTaskId);
  }
}
