import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Permissions } from 'back/src/models/permissions';
import { PlanningFullView } from 'back/src/models/responses/planning';
import { TaskResponse } from 'back/src/models/responses/task.response';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-mark-tasks',
  templateUrl: './mark-tasks.component.html',
  styleUrls: ['./mark-tasks.component.less'],
})
export class MarkTasksComponent implements OnInit {
  public planning: PlanningFullView | undefined;
  private projectId: number;
  public permissions = Permissions;
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private socketService: SocketService,
    public projectDataService: ProjectDataService,
    private router: Router,
  ) {}
  public ngOnInit(): void {
    this.socketService.of('startPlanningSprint').subscribe(() => {
      this.router.navigate(['../../board'], { relativeTo: this.activatedRoute });
    });
    this.socketService.of('updatePlanning').subscribe(() => {
      this.getPlanning(this.projectId, this.planning?.id);
    });
    this.socketService.of('startPocker').subscribe(({ taskId, sessionId }) => {
      const task =
        this.planning?.notMarkedTasks.find((t) => t.id === taskId) ||
        this.planning?.completedSessions.find((s) => s.task.id === taskId);
      if (task) {
        task.activeSessionId = sessionId;
        if (task.activeSessionId) {
          this.router.navigate(['task', task.id], { relativeTo: this.activatedRoute });
        }
      }
    });
    this.activatedRoute.params.subscribe((params) => {
      if (params.planningId) {
        this.projectId = params.id;
        this.getPlanning(params.id, params.planningId);
      }
    });
  }

  public canStartPocker() {
    return !this.planning?.notMarkedTasks.some((task) => task.activeSessionId);
  }

  public onRemoveFromSprintClick(taskId: number) {
    this.socketService.removePlanningTask(this.projectId, taskId);
  }

  public getPlanning(projectId: number, id?: number) {
    if (!id) {
      return;
    }
    this.projectService.getPlanning(projectId, id).subscribe((planning) => {
      this.planning = planning;
    });
  }

  public onStartSprintClick() {
    if (!this.planning) {
      return;
    }
    this.socketService.startPlanningSprint(this.planning?.sprintId, this.projectId);
  }

  public onStartPokerClick(task: TaskResponse) {
    if (!this.planning) {
      return;
    }
    this.socketService.startPocker(this.projectId, task.id);
  }
}
