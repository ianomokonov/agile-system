import { Component, Input } from '@angular/core';
import { TaskResponse } from 'back/src/models/responses/task.response';

@Component({
  selector: 'app-discuss-new-tasks',
  templateUrl: './discuss-new-tasks.component.html',
  styleUrls: ['./discuss-new-tasks.component.less'],
})
export class DiscussNewTasksComponent {
  @Input() public tasks: TaskResponse[] = [];
}
