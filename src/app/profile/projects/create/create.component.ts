import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { Permissions } from 'back/src/models/permissions';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less'],
})
export class CreateComponent implements OnInit, OnDestroy {
  public projectId: number;
  public permissions = Permissions;
  private rxAlive = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    public projectDataService: ProjectDataService,
    private projectService: ProjectService,
    private router: Router,
  ) {}

  public ngOnInit() {
    this.activatedRoute.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      this.projectId = params.id;
      if (!this.projectDataService.PID[this.permissions.CanReadProject]) {
        this.projectService.getUserPermissions(this.projectId).subscribe((p) => {
          this.projectDataService.setPID(p);
          if (!this.projectDataService.PID[this.permissions.CanEditProject]) {
            this.router.navigate(['/profile']);
          }
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public deleteProject() {
    if (!confirm('Вы точно хотите удалить проект?')) {
      return;
    }
    this.projectService
      .deleteProject(this.projectId)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
  }
}
