import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { TaskService } from 'src/app/services/task.service';
import { PriorityPipe } from 'src/app/shared/pipes/priority.pipe';
import { TaskTypePipe } from 'src/app/shared/pipes/task-type.pipe';
import { taskFields } from 'src/app/utils/constants';
import { TaskDataService } from './task-data.service';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.less'],
})
export class TaskHistoryComponent implements OnInit, OnDestroy {
  public history: any[];
  private taskId: number;
  private rxAlive = true;

  constructor(
    private taskService: TaskService,
    private taskTypePipe: TaskTypePipe,
    private priorityPipe: PriorityPipe,
    private activatedRoute: ActivatedRoute,
    private taskDataService: TaskDataService,
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.getHistory(params.taskId);
      this.taskId = params.taskId;
    });
    this.taskDataService.taskUpdated$.pipe(takeWhile(() => this.rxAlive)).subscribe(() => {
      if (this.taskId) {
        this.getHistory(this.taskId);
      }
    });
  }

  public ngOnDestroy() {
    this.rxAlive = false;
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
    if (item.fieldName === 'epicId') {
      return item.epic?.name;
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
