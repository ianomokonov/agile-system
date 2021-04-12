import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { ProjectResponse } from 'back/src/models/responses/project.response';
import { ProfileService } from '../services/profile.service';
import { ProjectDataService } from '../services/project-data.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less'],
})
export class ProjectComponent implements OnInit {
  public get project(): ProjectResponse {
    return this.projectDataService.project;
  }
  public user: GetProfileInfoResponse;
  constructor(
    public projectDataService: ProjectDataService,
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
    this.projectDataService.getProject(id).subscribe();
  }
}
