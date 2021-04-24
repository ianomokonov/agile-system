import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Time } from 'back/src/models/time';

@Component({
  selector: 'app-finish-daily-modal',
  templateUrl: './finish-daily-modal.component.html',
  styleUrls: ['./finish-daily-modal.component.less'],
})
export class FinishDailyModalComponent {
  public time: string;
  public participantsCount: number;
  constructor(private modalService: NgbModal, private modal: NgbActiveModal) {}

  public dismiss() {
    this.modalService.dismissAll();
  }

  public redirect(path: string) {
    this.modal.close(path);
  }

  public getAvgTime() {
    if (!this.participantsCount || this.participantsCount === 1) {
      return this.time;
    }

    const [minutes, seconds] = this.time.split(':');
    const timeNumber = parseInt(minutes, 10) * 60000 + parseInt(seconds, 10) * 1000;
    const avgTime = timeNumber / this.participantsCount;

    return new Time(0, Math.floor(avgTime / 60000), Math.ceil((avgTime % 60000) / 1000));
  }
}
