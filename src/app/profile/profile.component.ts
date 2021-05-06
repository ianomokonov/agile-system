import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from 'back/src/models/project';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { takeWhile } from 'rxjs/operators';
import { ProfileService } from '../services/profile.service';
import { EditUserComponent } from './create/edit-user.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userInfo!: GetProfileInfoResponse;
  private rxAlive = true;

  private readonly ADMIN_ROLE = 'admin';

  public get myProjects(): Project[] {
    return this.userInfo.projects;
  }

  public get othersProjects(): Project[] {
    return this.userInfo.projects.filter((p) => !p.isClosed);
  }

  public get closedProjects(): Project[] {
    return this.userInfo.projects.filter((p) => p.isClosed);
  }

  public get userImage() {
    return this.userInfo.image
      ? `url(${this.userInfo?.image})`
      : 'url(../../assets/images/default_ava.jpg)';
  }

  constructor(
    private modalService: NgbModal,
    private profileService: ProfileService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.profileService
      .getUser(true)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(
        (info) => {
          this.userInfo = info;
        },
        () => {
          this.onLogoutClick();
        },
      );
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public onEditUserClick() {
    const modal = this.modalService.open(EditUserComponent);
    modal.componentInstance.user = this.userInfo;
    modal.closed.pipe(takeWhile(() => this.rxAlive)).subscribe(() => {
      this.ngOnInit();
    });
  }

  public onLogoutClick() {
    this.profileService
      .logout()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(
        () => {
          this.router.navigate(['/sign-in']);
        },
        () => {
          this.router.navigate(['/sign-in']);
        },
      );
  }
}
