import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningFullView } from 'back/src/models/responses/planning';
import { PlanningDataService } from 'src/app/services/planning-data.service';
import { ProjectService } from 'src/app/services/project.service';

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
    private planningDataService: PlanningDataService,
    private projectService: ProjectService,
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

  public getPlanning(projectId: number, id: number) {
    this.planningDataService.getPlanning(projectId, id, true).subscribe((planning) => {
      this.planning = planning;
    });
  }

  public onStartPokerClick(taskId: number) {
    if (!this.planning) {
      return;
    }
    if (this.planning.activeTaskId === taskId) {
      this.router.navigate(['task', taskId], { relativeTo: this.activatedRoute });
      return;
    }
    this.projectService
      .updatePlanning(this.projectId, this.planning.id, { activeTaskId: taskId })
      .subscribe(() => {
        this.router.navigate(['task', taskId], { relativeTo: this.activatedRoute });
      });
  }
}
