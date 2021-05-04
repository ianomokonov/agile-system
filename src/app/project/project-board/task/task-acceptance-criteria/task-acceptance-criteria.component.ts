import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateCriteriaModalComponent } from './update-criteria-modal/update-criteria-modal.component';

@Component({
  selector: 'app-task-acceptance-criteria',
  templateUrl: './task-acceptance-criteria.component.html',
  styleUrls: ['./task-acceptance-criteria.component.less'],
})
export class TaskAcceptanceCriteriaComponent implements OnInit {
  public criterias: any[] = [
    { name: 'Rhbnthbq 1', description: 'dfjdskfjskd sdfsdfdskf jsd sdfjsdfksdfjsd sdf sdf' },
  ];
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  public toggleCriteria(criteriaTemp) {
    const criteria = criteriaTemp;
    criteria.isOpened = !criteria.isOpened;
  }

  public openModal(value?) {
    const modal = this.modalService.open(UpdateCriteriaModalComponent);
    modal.componentInstance.setCriteria(value);
    modal.closed.subscribe((result) => {
      this.criterias.push(result);
    });
  }
}
