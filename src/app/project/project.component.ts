import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Permissions } from 'back/src/models/permissions';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { ProjectResponse } from 'back/src/models/responses/project.response';
import { takeWhile } from 'rxjs/operators';
import { ProfileService } from '../services/profile.service';
import { ProjectDataService } from '../services/project-data.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  private rxAlive = true;
  public permissions = Permissions;
  public get project(): ProjectResponse {
    return this.projectDataService.project;
  }
  public get userImage() {
    return this.user.image ? `url(${this.user.image})` : 'url(../../assets/images/default_ava.jpg)';
  }
  public user: GetProfileInfoResponse;
  constructor(
    public projectDataService: ProjectDataService,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private projectSecrive: ProjectService,
  ) {}

  public ngOnInit(): void {
    this.profileService
      .getUser()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((user) => {
        this.user = user;
      });
    this.activatedRoute.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      this.getProjectInfo(params.id);
    });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public getProjectInfo(id: number) {
    this.projectDataService
      .getProject(id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe();
    this.projectSecrive
      .getUserPermissions(id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((permissions) => {
        this.projectDataService.setPID(permissions);
      });
  }
}
