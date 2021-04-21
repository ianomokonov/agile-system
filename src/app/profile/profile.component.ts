import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from 'back/src/models/project';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { ProfileService } from '../services/profile.service';
import { EditUserComponent } from './create/edit-user.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit {
  public userInfo!: GetProfileInfoResponse;

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

  constructor(
    private modalService: NgbModal,
    private profileService: ProfileService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.profileService.getUser(true).subscribe((info) => {
      this.userInfo = info;
    });
  }
  public onEditUserClick() {
    const modal = this.modalService.open(EditUserComponent);
    modal.componentInstance.user = this.userInfo;
    modal.closed.subscribe(() => {
      this.ngOnInit();
    });
  }

  public onLogoutClick() {
    this.profileService.logout().subscribe(() => {
      this.router.navigate(['/sign-in']);
    });
  }
}
