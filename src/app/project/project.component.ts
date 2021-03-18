import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { ProjectResponse } from 'back/src/models/responses/project.response';
import { ProfileService } from '../services/profile.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less'],
})
export class ProjectComponent implements OnInit {
  public project: ProjectResponse;
  public user: GetProfileInfoResponse;
  constructor(
    private projectService: ProjectService,
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
    this.projectService.getProject(id).subscribe((info) => {
      this.project = info;
    });
  }
}
