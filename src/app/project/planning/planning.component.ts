import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningFullView, PlanningStep } from 'back/src/models/responses/planning';
import { takeWhile } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.less'],
})
export class PlanningComponent implements OnInit, OnDestroy {
  private rxAlive = true;
  public planning: PlanningFullView;
  public planningStep = PlanningStep;
  private projectId: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    public socketService: SocketService,
  ) {
    this.socketService
      .of('updatePlanning')
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.getPlanning(this.planning.id);
      });
  }
  public ngOnInit(): void {
    this.activatedRoute.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      if (params.planningId) {
        this.projectId = params.id;
        this.getPlanning(params.planningId);
      }
    });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public getPlanning(id: number) {
    this.projectService
      .getPlanning(this.projectId, id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((planning) => {
        this.planning = planning;
        this.socketService.enterPlanningRoom(this.projectId, this.planning.id);
      });
  }

  public goHome() {
    this.router.navigate(['/project', this.projectId, 'planning', this.planning.id]);
  }
}
