import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeWhile } from 'rxjs/operators';
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
export class MarkTasksComponent implements OnInit, OnDestroy {
  @ViewChild('emptyTaskModal') public modalContent: TemplateRef<any>;
  private rxAlive = true;
  public planning: PlanningFullView | undefined;
  private projectId: number;
  public permissions = Permissions;
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private socketService: SocketService,
    public projectDataService: ProjectDataService,
    private router: Router,
    private modalService: NgbModal,
  ) {}
  public ngOnInit(): void {
    this.socketService
      .of('startPlanningSprint')
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.router.navigate(['../../board'], { relativeTo: this.activatedRoute });
      });
    this.socketService
      .of('updatePlanning')
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.getPlanning(this.projectId, this.planning?.id);
      });
    this.socketService
      .of('startPocker')
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(({ taskId, sessionId }) => {
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
    this.activatedRoute.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      if (params.planningId) {
        this.projectId = params.id;
        this.getPlanning(params.id, params.planningId);
      }
    });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
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
    this.projectService
      .getPlanning(projectId, id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((planning) => {
        this.planning = planning;
      });
  }

  public onStartSprintClick() {
    if (!this.planning) {
      return;
    }
    if (this.planning.completedSessions.length === 0) {
      this.open();
      return;
    }
    this.socketService.startPlanningSprint(this.planning?.sprintId, this.projectId);
  }

  private open() {
    this.modalService.open(this.modalContent, { ariaLabelledBy: 'modal-basic-title' });
  }

  public startSprint(modal: NgbActiveModal) {
    modal.dismiss();
    this.socketService.startPlanningSprint(this.planning?.sprintId, this.projectId);
  }

  public onStartPokerClick(task: TaskResponse) {
    if (!this.planning) {
      return;
    }
    this.socketService.startPocker(this.projectId, task.id);
  }
}
