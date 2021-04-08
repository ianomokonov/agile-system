import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskShortView } from 'back/src/models/responses/task-short-view';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.less'],
})
export class TaskListComponent {
  @Input() public tasks: TaskShortView[];
  @Output() public taskClick: EventEmitter<number> = new EventEmitter();

  public onTaskClick(taskId: number) {
    this.taskClick.emit(taskId);
  }
}
