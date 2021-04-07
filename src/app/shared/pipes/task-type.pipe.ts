import { Pipe, PipeTransform } from '@angular/core';
import { TaskType } from 'back/src/models/task-type';
import { taskTypes } from 'src/app/utils/constants';

@Pipe({
  name: 'taskType',
})
export class TaskTypePipe implements PipeTransform {
  public transform(value: TaskType): string {
    return taskTypes.find((p) => p.id === value)?.name || '';
  }
}
