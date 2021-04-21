import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Priority } from 'back/src/models/priority';

@Directive({
  selector: '[taskPriority]',
})
export class TaskPriorityDirective implements OnInit {
  @Input() public taskPriority: Priority;
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  public ngOnInit() {
    switch (this.taskPriority) {
      case Priority.Low: {
        this.elementRef.nativeElement.classList.add('badge', 'bg-light', 'text-dark');
        break;
      }
      case Priority.Medium: {
        this.elementRef.nativeElement.classList.add('badge', 'bg-warning', 'text-dark');
        break;
      }
      case Priority.Hight: {
        this.elementRef.nativeElement.classList.add('badge', 'bg-danger');
        break;
      }
      case Priority.Critical: {
        this.elementRef.nativeElement.classList.add('badge', 'bg-danger-darker');
        break;
      }
      default:
        break;
    }
  }
}
