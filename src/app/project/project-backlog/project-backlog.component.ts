import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskShortView } from 'back/src/models/responses/task-short-view';
import { ProjectDataService } from 'src/app/services/project-data.service';

@Component({
  selector: 'app-project-backlog',
  templateUrl: './project-backlog.component.html',
  styleUrls: ['./project-backlog.component.less'],
})
export class ProjectBacklogComponent implements OnInit {
  public tasks: TaskShortView[];
  constructor(
    private projectDataService: ProjectDataService,
    private activatedRoute: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.projectDataService.getProject(params.id).subscribe((project) => {
        this.tasks = project.tasks;
      });
    });
  }
}
