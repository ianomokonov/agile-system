import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectResponse } from 'back/src/models/responses/project.response';
import { TaskShortView } from 'back/src/models/responses/task-short-view';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { forkJoin } from 'rxjs';
import { DemoService } from 'src/app/services/demo.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';
import { RetroService } from 'src/app/services/retro.service';
import { TaskService } from 'src/app/services/task.service';
import { CreateTaskComponent } from './create-task/create-task.component';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.less'],
})
export class ProjectBoardComponent implements OnInit {
  public project: ProjectResponse;
  public delay: number;
  private users: UserShortView[];
  public tasks: TaskShortView[][] = [];
  constructor(
    private taskService: TaskService,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private projectDataService: ProjectDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private demoService: DemoService,
    private retroService: RetroService,
  ) {}
  public ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.projectDataService.getProject(params.id, true).subscribe((project) => {
        if (!project.sprint) {
          this.router.navigate(['../backlog'], { relativeTo: this.activatedRoute });
          return;
        }
        this.project = project;
        this.setTasks(project.sprint?.tasks);
        this.users = this.project.users;
      });
    });
  }
  public getFinishDate(startDate?: Date) {
    if (!startDate) {
      return null;
    }
    const finishDate = new Date(startDate);
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    finishDate.setDate(finishDate.getDate() + 14);
    if (today.getTime() > finishDate.getTime()) {
      this.delay = new Date(today.getTime() - finishDate.getTime()).getUTCDate() - 1;
      return today;
    }
    return finishDate;
  }
  private setTasks(tasks: TaskShortView[]) {
    this.tasks = [];
    this.project?.statuses?.forEach((status) => {
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
    this.projectDataService.getProject(id, true).subscribe((info) => {
      this.project = info;
      this.setTasks(info.sprint?.tasks);
    });
  }

  public onStartDemo() {
    this.demoService
      .start(this.projectDataService.project?.id, this.project?.sprint?.id)
      .subscribe((demoId) => {
        this.projectDataService
          .getProject(this.projectDataService.project?.id, true)
          .subscribe(() => {
            this.router.navigate(['../demo', demoId], { relativeTo: this.activatedRoute });
          });
      });
  }

  public onStartRetro() {
    this.retroService
      .start(this.projectDataService.project?.id, this.projectDataService.project?.sprint?.id)
      .subscribe((retroId) => {
        this.projectDataService
          .getProject(this.projectDataService.project?.id, true)
          .subscribe(() => {
            this.router.navigate(['../retro', retroId], { relativeTo: this.activatedRoute });
          });
      });
  }

  public canStartDemo(): boolean {
    if (this.project.demo) {
      return false;
    }

    return !!this.project.sprint?.tasks.find((t) => t.statusId === 7);
  }
}
