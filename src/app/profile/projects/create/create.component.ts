import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less'],
})
export class CreateComponent implements OnInit, OnDestroy {
  public projectId: number;
  private rxAlive = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
  ) {}

  public ngOnInit() {
    this.activatedRoute.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      this.projectId = params.id;
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
