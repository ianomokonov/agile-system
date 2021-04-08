import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.less'],
})
export class PlanningComponent implements OnInit {
  public planning;
  constructor(private activatedRoute: ActivatedRoute, private projectService: ProjectService) {}

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.planningId) {
        this.getPlanning(params.id, params.planningId);
      }
    });
  }

  public getPlanning(projectId: number, id: number) {
    this.projectService.getPlanning(projectId, id).subscribe((planning) => {
      this.planning = planning;
    });
  }
}
