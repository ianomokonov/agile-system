import { Component } from '@angular/core';
import { MenuItem } from '../header/menu-item';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less'],
})
export class ProjectComponent {
  public menuItems: MenuItem[] = [
    {
      link: 'tasks',
      displayName: 'Задачи',
    },
    {
      link: 'dashboards',
      displayName: 'Доски',
    },
    {
      link: 'team',
      displayName: 'Команда',
    },
    {
      link: 'statistics',
      displayName: 'Статистика',
    },
  ];
}
