import { Component, OnInit } from '@angular/core';
import { TaskShortView } from 'back/src/models/responses/task-short-view';
import { ProjectDataService } from 'src/app/services/project-data.service';

@Component({
  selector: 'app-project-backlog',
  templateUrl: './project-backlog.component.html',
  styleUrls: ['./project-backlog.component.less'],
})
export class ProjectBacklogComponent implements OnInit {
  public tasks: TaskShortView[];
  constructor(private projectDataService: ProjectDataService) {}

  public ngOnInit(): void {
    this.tasks = this.projectDataService.project.tasks;
  }
}
