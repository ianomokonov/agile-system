import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusResponse } from 'back/src/models/responses/status.response';
import { TaskShortView } from 'back/src/models/responses/task-short-view';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { forkJoin } from 'rxjs';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { CreateSprintComponent } from '../create-sprint/create-sprint.component';
import { CreateTaskComponent } from './create-task/create-task.component';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.less'],
})
export class ProjectBoardComponent implements OnInit {
  public statuses: StatusResponse[];
  private users: UserShortView[];
  public tasks: TaskShortView[][] = [];
  constructor(
    private taskService: TaskService,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private projectDataService: ProjectDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}
  public ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((params) => {
      forkJoin([
        this.projectDataService.getProject(params.id),
        this.projectService.getProjectUsers(params.id),
      ]).subscribe(([project, users]) => {
        if (!project.sprint) {
          this.router.navigate(['../backlog'], { relativeTo: this.activatedRoute });
          return;
        }
        this.statuses = project.statuses;
        this.setTasks(project.sprint?.tasks);
        this.users = users;
      });
    });
  }
  private setTasks(tasks: TaskShortView[]) {
    this.tasks = [];
    if (!tasks?.length) {
      return;
    }
    this.statuses?.forEach((status) => {
      this.tasks.push(tasks.filter((task) => task.statusId === status.id));
    });
  }

  public createTask() {
    const modal = this.modalService.open(CreateTaskComponent, { centered: true });
    modal.componentInstance.users = this.users;
    modal.result
      .then((task) => {
        this.projectService.addTask(this.projectDataService.project.id, task).subscribe(() => {
          this.refreshProjectInfo(this.projectDataService.project.id);
        });
      })
      .catch(() => {});
  }

  public changeStatus(event: CdkDragDrop<TaskShortView[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.taskService
        .updateTaskStatus(+event.container.data[event.currentIndex].id, +event.container.id)
        .subscribe(() => {
          this.refreshProjectInfo(this.projectDataService.project.id);
        });
    }
  }

  public refreshProjectInfo(id: number) {
    this.projectDataService.getProject(id).subscribe((info) => {
      this.statuses = info.statuses;
      this.setTasks(info.sprint?.tasks);
    });
  }
}
