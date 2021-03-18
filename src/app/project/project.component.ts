import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { ProjectResponse } from 'back/src/models/responses/project.response';
import { StatusResponse } from 'back/src/models/responses/status.response';
import { TaskShortView } from 'back/src/models/responses/task-short-view';
import { ProfileService } from '../services/profile.service';
import { ProjectDataService } from '../services/project-data.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less'],
})
export class ProjectComponent implements OnInit {
  public project: ProjectResponse;
  public user: GetProfileInfoResponse;
  public boardInfo: [TaskShortView[], StatusResponse[]] = [[], []];
  constructor(
    private projectDataService: ProjectDataService,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
  ) {}

  public ngOnInit(): void {
    this.profileService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.activatedRoute.params.subscribe((params) => {
      this.getProjectInfo(params.id);
    });
  }

  public getProjectInfo(id: number) {
    this.projectDataService.getProject(id).subscribe((info) => {
      this.project = info;
      this.boardInfo = [info.tasks, info.statuses];
    });
  }
}
