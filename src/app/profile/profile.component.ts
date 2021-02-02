import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditUserComponent } from './create/edit-user.component';
import { Project } from './models/project';
import { User } from './models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent {
  public userInfo: User = {
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

  constructor(private modalService: NgbModal) {}

  public onEditUserClick() {
    const modal = this.modalService.open(EditUserComponent);
    modal.componentInstance.user = this.userInfo;
    modal.closed.subscribe((result) => {
      this.userInfo = { ...result };
    });
  }
}