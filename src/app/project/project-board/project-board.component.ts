import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusResponse } from 'back/src/models/responses/status.response';
import { TaskShortView } from 'back/src/models/responses/task-short-view';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { CreateTaskComponent } from './create-task/create-task.component';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.less'],
})
export class ProjectBoardComponent implements OnInit {
  @Input() public projectId: number;
  @Input() public set info([tasks, statuses]: [TaskShortView[], StatusResponse[]]) {
    this.statuses = statuses;
    this.setTasks(tasks);
  }
  @Output() public update: EventEmitter<void> = new EventEmitter();

  public statuses: StatusResponse[];
  private users: UserShortView[];
  public tasks: TaskShortView[][] = [];
  constructor(
    private taskService: TaskService,
    private modalService: NgbModal,
    private projectService: ProjectService,
  ) {}
  public ngOnInit() {
    this.projectService.getProjectUsers(this.projectId).subscribe((users) => {
      this.users = users;
    });
  }
  private setTasks(tasks: TaskShortView[]) {
    this.statuses.forEach((status) => {
      this.tasks.push(tasks.filter((task) => task.statusId === status.id));
    });
  }

  public createTask() {
    const modal = this.modalService.open(CreateTaskComponent, { centered: true });
    modal.componentInstance.users = this.users;
    modal.result
      .then((task) => {
        this.projectService.addTask(this.projectId, task).subscribe(() => {
          this.update.emit();
        });
      })
      .catch(() => {});
  }
}
