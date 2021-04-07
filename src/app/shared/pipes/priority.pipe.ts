import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from 'back/src/models/priority';
import { priorities } from 'src/app/utils/constants';

@Pipe({
  name: 'priority',
})
export class PriorityPipe implements PipeTransform {
  public transform(value: Priority): string {
    return priorities.find((p) => p.id === value)?.name || '';
  }
}
