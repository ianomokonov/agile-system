import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusResponse } from 'back/src/models/responses/status.response';
import { TaskShortView } from 'back/src/models/responses/task-short-view';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
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
  ) {}
  public ngOnInit() {
    this.projectService.getProjectUsers(this.projectDataService.project.id).subscribe((users) => {
      this.users = users;
    });
    this.statuses = this.projectDataService.project.statuses;
    this.setTasks(this.projectDataService.project.tasks);
  }
  private setTasks(tasks: TaskShortView[]) {
    this.tasks = [];
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
      this.setTasks(info.tasks);
    });
  }
}
