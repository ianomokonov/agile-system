import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemoService } from 'src/app/services/demo.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less'],
})
export class DemoComponent implements OnInit {
  private projectId: number;
  public demo;
  public activeTask: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private demoService: DemoService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.demoId) {
        this.projectId = params.id;
        this.getDemo();
      }
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.demoTaskId && this.demo) {
        this.setActiveTask(params.demoTaskId);
      }
    });
  }

  public onTaskClick(demoTaskId) {
    this.router.navigate([], {
      queryParams: { demoTaskId },
      relativeTo: this.activatedRoute,
    });
  }

  public acceptTask(demoTaskId) {
    if (!this.activeTask) {
      return;
    }

    this.demoService.finishTask(this.projectId, demoTaskId).subscribe(() => {
      if (this.demo.taskToShow.length !== 1) {
        this.onTaskClick(this.demo.taskToShow.find((t) => t.id !== demoTaskId).id);
      }
      this.getDemo();
    });
  }

  private getDemo() {
    this.demoService.read(this.projectId).subscribe((demo) => {
      this.demo = demo;

      if (this.activatedRoute.snapshot.queryParams.demoTaskId) {
        this.setActiveTask(this.activatedRoute.snapshot.queryParams.demoTaskId);
      }
    });
  }

  private setActiveTask(demoTaskId) {
    this.activeTask =
      this.demo.taskToShow?.find((task) => task.id === +demoTaskId) ||
      this.demo.shownTasks?.find((task) => task.id === +demoTaskId);
  }
}
