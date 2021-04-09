import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-scrum-poker',
  templateUrl: './scrum-poker.component.html',
  styleUrls: ['./scrum-poker.component.less'],
})
export class ScrumPokerComponent {
  public marks = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];
  public activeMark;
  public showCards = false;
  public session;
  private projectId: number;
  private planningId: number;

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe((params) => {
      if (params.taskId && params.planningId) {
        this.getSession(params as any);
        this.projectId = params.id;
        this.planningId = params.planningId;
      }
    });
  }

  public getSession({ id, taskId, planningId }) {
    this.projectService.getPlanningSession(id, planningId, taskId).subscribe((session) => {
      this.session = session;
      this.activeMark = session.cards.find((c) => c.isMy).value;
    });
  }

  public setCard(value) {
    this.projectService.setSessionCard(this.projectId, this.session?.id, value).subscribe(() => {
      this.getSession({
        id: this.projectId,
        taskId: this.session.task.id,
        planningId: this.planningId,
      });
    });
  }
}
