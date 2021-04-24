import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Backlog } from 'back/src/models/responses/backlog';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { Sprint } from 'back/src/models/sprint';
import { DemoService } from 'src/app/services/demo.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
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
  public showTasks = false;
  constructor(
    private projectService: ProjectService,
    public projectDataService: ProjectDataService,
    private demoService: DemoService,
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private modalService: NgbModal,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.getBackLog(+params.id);
      this.projectDataService.getProject(+params.id).subscribe((project) => {
        this.users = project.users;
      });
    });
  }

  public toggleSprint(sprintTemp?: Sprint) {
    if (sprintTemp) {
      const sprint = sprintTemp;
      sprint.isOpened = !sprint.isOpened;
      return;
    }

    this.showTasks = !this.showTasks;
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

  public onAddToActiveSprint(taskId: number) {
    if (this.projectDataService.project?.sprint) {
      this.taskService
        .editTask(taskId, {
          projectSprintId: this.projectDataService.project?.sprint.id,
        })
        .subscribe(() => {
          this.getBackLog(this.projectDataService.project?.id);
        });
    }
  }

  public onCreateSprint() {
    const modal = this.modalService.open(CreateSprintComponent, { centered: true });
    modal.result
      .then((sprint) => {
        this.projectService.addSprint(this.projectDataService.project.id, sprint).subscribe(() => {
          this.getBackLog(this.projectDataService.project.id);
        });
      })
      .catch(() => {});
  }

  public canStartDemo(sprint): boolean {
    if (sprint.demo) {
      return false;
    }

    return !!sprint.tasks.find((t) => t.statusId === 7);
  }

  public onStartPlanning(sprintId) {
    if (this.projectDataService.project.activePlanningId) {
      this.projectService
        .updatePlanning(
          this.projectDataService.project.id,
          this.projectDataService.project.activePlanningId,
          { sprintId },
        )
        .subscribe(() => {
          this.projectDataService.getProject(this.projectDataService.project.id, true);
          this.router.navigate(['planning', this.projectDataService.project.activePlanningId], {
            relativeTo: this.activatedRoute.parent,
          });
        });
      return;
    }

    this.projectService
      .startPlanning(
        this.projectDataService.project.id,
        sprintId,
        this.projectDataService.project.sprint?.id,
      )
      .subscribe((planningId) => {
        this.projectDataService.getProject(this.projectDataService.project.id, true);
        this.router.navigate(['planning', planningId], {
          relativeTo: this.activatedRoute.parent,
        });
      });
  }

  public onStartDemo(sprintId) {
    this.demoService.start(this.projectDataService.project?.id, sprintId).subscribe((demoId) => {
      this.projectDataService
        .getProject(this.projectDataService.project?.id, true)
        .subscribe(() => {
          this.router.navigate(['../demo', demoId], { relativeTo: this.activatedRoute });
        });
    });
  }

  public onFinishSprint(sprintId) {
    this.projectService.finishSprint(this.projectDataService.project.id, sprintId).subscribe(() => {
      this.projectDataService
        .getProject(this.projectDataService.project?.id, true)
        .subscribe(() => {
          this.getBackLog(this.projectDataService.project.id);
        });
    });
  }

  public getBackLog(projectId: number) {
    this.projectService.getProjectBacklog(projectId).subscribe((backlog) => {
      this.backlog = backlog;
      this.toggleSprint(this.backlog.sprints?.find((s) => s.isActive));
    });
  }
}
