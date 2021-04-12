import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningFullView } from 'back/src/models/responses/planning';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-mark-tasks',
  templateUrl: './mark-tasks.component.html',
  styleUrls: ['./mark-tasks.component.less'],
})
export class MarkTasksComponent implements OnInit {
  public planning: PlanningFullView | undefined;
  private projectId: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private router: Router,
  ) {}
  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.planningId) {
        this.projectId = params.id;
        this.getPlanning(params.id, params.planningId);
      }
    });
  }

  public onRemoveFromSprintClick(taskId: number) {
    this.taskService.editTask(taskId, { projectSprintId: null }).subscribe(() => {
      if (this.planning) {
        this.planning.notMarkedTasks = this.planning?.notMarkedTasks.filter((t) => t.id !== taskId);
      }
    });
  }

  public getPlanning(projectId: number, id: number) {
    this.projectService.getPlanning(projectId, id).subscribe((planning) => {
      this.planning = planning;
    });
  }

  public onStartSprintClick() {
    if (!this.planning) {
      return;
    }
    this.projectService.startSprint(this.projectId, this.planning?.sprintId).subscribe(() => {
      this.router.navigate(['../../board'], { relativeTo: this.activatedRoute });
    });
  }

  public onStartPokerClick(task: TaskResponse) {
    if (!this.planning) {
      return;
    }
    if (task.activeSessionId) {
      this.router.navigate(['task', task.id], { relativeTo: this.activatedRoute });
      return;
    }
    this.projectService
      .updatePlanning(this.projectId, this.planning.id, { activeTaskId: task.id })
      .subscribe(() => {
        this.router.navigate(['task', task.id], { relativeTo: this.activatedRoute });
      });
  }
}
