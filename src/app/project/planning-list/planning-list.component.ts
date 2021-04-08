import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-planning-list',
  templateUrl: './planning-list.component.html',
  styleUrls: ['./planning-list.component.less'],
})
export class PlanningListComponent implements OnInit {
  public plannings: any[] = [];
  constructor(
    private projectDataService: ProjectDataService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    if (this.projectDataService.project) {
      this.getPlanningList(this.projectDataService.project.id);
      return;
    }

    this.activatedRoute.parent?.params.subscribe((params) => {
      if (params.id) {
        this.getPlanningList(params.id);
      }
    });
  }

  public getPlanningList(projectId: number) {
    this.projectService.getPlanningList(projectId).subscribe((list) => {
      this.plannings = list;
    });
  }
}
