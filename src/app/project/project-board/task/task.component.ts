import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less'],
})
export class TaskComponent {
  public task: TaskResponse;
  constructor(private activatedRoute: ActivatedRoute, private taskService: TaskService) {
    this.activatedRoute.params.subscribe((params) => {
      this.getTaskInfo(params.id);
    });
  }

  private getTaskInfo(id: number) {
    this.taskService.getTask(id).subscribe((task) => {
      this.task = task;
    });
  }
}
