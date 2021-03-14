import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetProfileInfoResponse } from 'back/src/models/responses/get-profile-info.response';
import { UserService } from '../services/user.service';
import { EditUserComponent } from './create/edit-user.component';
import { Project } from './models/project';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit {
  public userInfo: GetProfileInfoResponse = {
    name: 'Ванька',
    surname: 'Номоконов',
    email: 'vanika.koma@yandex.ru',
    vk: 'https://vk.com/vanikakoma',
    gitHub: 'https://github.com/ianomokonov',
  };
  private projects: Project[] = [
    {
      name: 'Agile system',
      roles: ['admin', 'developer'],
      date: new Date(),
      isClosed: false,
    },
    {
      name: 'Agile system 1',
      roles: ['admin', 'developer'],
      date: new Date(),
      isClosed: true,
    },
    {
      name: 'Agile system 2',
      roles: ['developer'],
      date: new Date(),
      isClosed: false,
    },
    {
      name: 'Agile system 3',
      roles: ['testing'],
      date: new Date(),
      isClosed: false,
    },
  ];

  private readonly ADMIN_ROLE = 'admin';

  public get myProjects(): Project[] {
    return this.projects.filter((p) => !p.isClosed && p.roles.indexOf(this.ADMIN_ROLE) > -1);
  }

  public get othersProjects(): Project[] {
    return this.projects.filter((p) => !p.isClosed && p.roles.indexOf(this.ADMIN_ROLE) < 0);
  }

  public get closedProjects(): Project[] {
    return this.projects.filter((p) => p.isClosed);
  }

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.userService.getProfile().subscribe((info) => {
      console.log(info);
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
