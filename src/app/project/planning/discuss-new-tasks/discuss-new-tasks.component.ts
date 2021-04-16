import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-discuss-new-tasks',
  templateUrl: './discuss-new-tasks.component.html',
  styleUrls: ['./discuss-new-tasks.component.less'],
})
export class DiscussNewTasksComponent {
  private tasksPrivate: TaskResponse[];
  @Input() public newSprintId: number;
  @Input() public set tasks(tasks) {
    this.tasksPrivate = tasks;
    if (this.activatedRoute.snapshot.queryParams.taskId) {
      this.setActiveTask(this.activatedRoute.snapshot.queryParams.taskId);
      return;
    }

    if (tasks?.length) {
      this.onTaskClick(tasks[0].id);
    }
  }
  public get tasks(): TaskResponse[] {
    return this.tasksPrivate;
  }
  @Output() public update: EventEmitter<void> = new EventEmitter();
  public activeTask: TaskResponse | undefined;
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private router: Router,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.taskId && this.tasks?.length) {
        this.setActiveTask(params.taskId);
      }
    });
  }

  public onTaskClick(taskId) {
    this.router.navigate([], {
      queryParams: { taskId },
      relativeTo: this.activatedRoute,
    });
  }

  public takeToSprint(taskId: number) {
    this.taskService.editTask(taskId, { projectSprintId: this.newSprintId }).subscribe(() => {
      this.update.emit();
    });
  }

  public removeFromSprint(taskId: number) {
    this.taskService.editTask(taskId, { projectSprintId: null }).subscribe(() => {
      this.update.emit();
    });
  }

  private setActiveTask(taskId) {
    this.activeTask = this.tasks?.find((task) => task.id === +taskId);
  }
}
