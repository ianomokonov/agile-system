import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectShortView } from 'back/src/models/responses/project-short-view';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less'],
})
export class ProjectsComponent {
  @Input() public canCreateProject = false;
  @Input() public hidable = false;
  @Input() public title = 'Мои проекты';
  @Input() public items: ProjectShortView[] = [];

  public isOpened = false;

  constructor(private router: Router) {}

  public onAddProjectClick() {
    if (!this.canCreateProject) {
      return;
    }

    this.router.navigate(['/create-project']);
  }
}
