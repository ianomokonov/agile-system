import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class TaskDataService {
  public taskUpdated$: Subject<void> = new Subject();
}
