import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from 'back/src/models/project';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { UserService } from '../services/user.service';
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
    private userService: UserService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.userService.getProfile().subscribe((info) => {
      this.userInfo = info;
    });
  }
  public onEditUserClick() {
    const modal = this.modalService.open(EditUserComponent);
    modal.componentInstance.user = this.userInfo;
    modal.closed.subscribe((result) => {
      this.userInfo = { ...this.userInfo, ...result };
    });
  }

  public onLogoutClick() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/sign-in']);
    });
  }
}
