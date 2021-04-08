import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningFullView, PlanningStep } from 'back/src/models/responses/planning';
import { PlanningDataService } from 'src/app/services/planning-data.service';

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
    private planningDataService: PlanningDataService,
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
    this.planningDataService.getPlanning(projectId, id).subscribe((planning) => {
      this.planning = planning;
    });
  }

  public goHome() {
    this.router.navigate(['/project', this.projectId, 'planning', this.planning.id]);
  }
}
