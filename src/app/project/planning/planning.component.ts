import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningFullView, PlanningStep } from 'back/src/models/responses/planning';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.less'],
})
export class PlanningComponent implements OnInit {
  public planning: PlanningFullView;
  public planningStep = PlanningStep;
  private projectId: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
  ) {}
  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.planningId) {
        this.projectId = params.id;
        this.getPlanning(params.planningId);
      }
    });
  }

  public getPlanning(id: number) {
    this.projectService.getPlanning(this.projectId, id).subscribe((planning) => {
      this.planning = planning;
    });
  }

  public goHome() {
    this.router.navigate(['/project', this.projectId, 'planning', this.planning.id]);
  }
}
