import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Backlog } from 'back/src/models/responses/backlog';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';
import { CreateSprintComponent } from '../create-sprint/create-sprint.component';
import { CreateTaskComponent } from '../project-board/create-task/create-task.component';

@Component({
  selector: 'app-project-backlog',
  templateUrl: './project-backlog.component.html',
  styleUrls: ['./project-backlog.component.less'],
})
export class ProjectBacklogComponent implements OnInit {
  public backlog: Backlog;
  private users: UserShortView[];
  constructor(
    private projectService: ProjectService,
    private projectDataService: ProjectDataService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.getBackLog(+params.id);
      this.projectDataService.getProject(+params.id).subscribe((project) => {
        this.users = project.users;
      });
    });
  }

  public onCreatTask() {
    const modal = this.modalService.open(CreateTaskComponent);
    modal.componentInstance.users = this.users;
    modal.result
      .then((task) => {
        this.projectService.addTask(this.projectDataService.project.id, task).subscribe(() => {
          this.getBackLog(this.projectDataService.project.id);
        });
      })
      .catch(() => {});
  }

  public onCreateSprint() {
    const modal = this.modalService.open(CreateSprintComponent, { centered: true });
    modal.result
      .then(({ startSprint, sprint }) => {
        console.log(startSprint, sprint);

        // this.projectService.addTask(this.projectDataService.project.id, task).subscribe(() => {
        //   this.refreshProjectInfo(this.projectDataService.project.id);
        // });
      })
      .catch(() => {});
  }

  public getBackLog(projectId: number) {
    this.projectService.getProjectBacklog(projectId).subscribe((backlog) => {
      this.backlog = backlog;
    });
  }
}
