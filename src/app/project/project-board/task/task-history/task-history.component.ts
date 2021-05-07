import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { PriorityPipe } from 'src/app/shared/pipes/priority.pipe';
import { TaskTypePipe } from 'src/app/shared/pipes/task-type.pipe';
import { taskFields } from 'src/app/utils/constants';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.less'],
})
export class TaskHistoryComponent implements OnInit {
  public history: any[];

  constructor(
    private taskService: TaskService,
    private taskTypePipe: TaskTypePipe,
    private priorityPipe: PriorityPipe,
    private activatedRoute: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.getHistory(params.taskId);
    });
  }

  private getHistory(taskId) {
    this.taskService.getHistory(taskId).subscribe((history) => {
      this.history = history;
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
      return this.taskTypePipe.transform(+item.newValue);
    }
    if (item.fieldName === 'priorityId') {
      return this.priorityPipe.transform(+item.newValue);
    }
    return item.newValue;
  }
}
