/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Permissions } from 'back/src/models/permissions';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { TaskService } from 'src/app/services/task.service';
import { UpdateCriteriaModalComponent } from './update-criteria-modal/update-criteria-modal.component';

@Component({
  selector: 'app-task-acceptance-criteria',
  templateUrl: './task-acceptance-criteria.component.html',
  styleUrls: ['./task-acceptance-criteria.component.less'],
})
export class TaskAcceptanceCriteriaComponent implements OnInit {
  @Input() public criterias: any[] = [];
  private taskId: number;
  @Input() public staticView = false;
  @Output() public done: EventEmitter<any> = new EventEmitter();
  public permissions = Permissions;
  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    public projectDataService: ProjectDataService,
  ) {}

  public ngOnInit() {
    if (!this.staticView) {
      this.activatedRoute.parent?.params.subscribe((params) => {
        this.taskId = params.taskId;
        this.getCriteria();
      });
    }
  }

  public onIsDoneChanged(criteria) {
    this.done.emit(criteria);
  }

  private getCriteria() {
    this.taskService.getAcceptanceCriteria(this.taskId).subscribe((criteria) => {
      this.criterias = criteria;
    });
  }

  public toggleCriteria(criteriaTemp) {
    const criteria = criteriaTemp;
    criteria.isOpened = !criteria.isOpened;
  }

  public openModal(value?) {
    if (this.staticView) {
      return;
    }
    const modal = this.modalService.open(UpdateCriteriaModalComponent);
    modal.componentInstance.setCriteria(value);
    modal.closed.subscribe((result) => {
      if (value) {
        this.taskService
          .updateCriteria(value.id, {
            name: result.name,
            description: result.description,
          })
          .subscribe(() => {
            value.name = result.name;
            value.description = result.description;
          });
        return;
      }
      this.taskService
        .createCriteria(this.taskId, {
          name: result.name,
          description: result.description,
        })
        .subscribe(() => {
          this.getCriteria();
        });
    });
  }

  public removeCriteria(criteriaId) {
    if (this.staticView) {
      return;
    }
    // eslint-disable-next-line no-alert
    if (!confirm('Вы уверены, что хотите удалить критерий?')) {
      return;
    }

    this.taskService.removeCriteria(criteriaId).subscribe(() => {
      this.getCriteria();
    });
  }
}
