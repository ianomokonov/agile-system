import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { TaskType } from 'back/src/models/task-type';

@Directive({
  selector: '[taskType]',
})
export class TaskTypeDirective implements OnInit {
  @Input() public taskType: TaskType;
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  public ngOnInit() {
    switch (this.taskType) {
      case TaskType.Bug: {
        this.elementRef.nativeElement.classList.add('badge', 'bg-danger');
        break;
      }
      case TaskType.Feature: {
        this.elementRef.nativeElement.classList.add('badge', 'bg-success');
        break;
      }
      case TaskType.Task: {
        this.elementRef.nativeElement.classList.add('badge', 'bg-primary');
        break;
      }
      default:
        break;
    }
  }
}
