import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { SocketService } from 'src/app/services/socket.service';

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

    if (
      this.activatedRoute.snapshot.queryParams.taskId &&
      this.tasks.find((t) => t.id === +this.activatedRoute.snapshot.queryParams.taskId)
    ) {
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
  public activeTask: TaskResponse | undefined;
  private projectId: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService,
    private router: Router,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.taskId && this.tasks?.length) {
        this.projectId = params.id;
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
    this.socketService.takePlanningTask(this.projectId, taskId, this.newSprintId);
  }

  public removeFromSprint(taskId: number) {
    this.socketService.removePlanningTask(this.projectId, taskId);
  }

  private setActiveTask(taskId) {
    this.activeTask = this.tasks?.find((task) => task.id === +taskId);
  }
}
