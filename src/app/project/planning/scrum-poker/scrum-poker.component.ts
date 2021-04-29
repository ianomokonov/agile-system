import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { SocketService } from 'src/app/services/socket.service';

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
  public showResultValue: boolean;
  public mantionedCards: { value: number; count: number }[] = [];
  private projectId: number;
  private planningId: number;
  private taskId: number;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService,
    private router: Router,
  ) {
    this.socketService.of('updatePlanningSession').subscribe(() => {
      this.getSession({ id: this.projectId, taskId: this.taskId, planningId: this.planningId });
    });
    activatedRoute.params.subscribe((params) => {
      if (params.taskId && params.planningId) {
        this.getSession(params as any);
        this.projectId = params.id;
        this.planningId = params.planningId;
        this.taskId = params.taskId;
      }
    });
  }

  public getSession({ id, taskId, planningId }) {
    this.mantionedCards = [];
    this.showResultValue = false;
    this.projectService.getPlanningSession(id, planningId, taskId).subscribe(
      (session) => {
        this.session = session;
        if (this.session.resultValue || this.session.resultValue === 0) {
          this.showResultValue = true;
        }
        this.activeMark = session.cards.find((c) => c.isMy)?.value;
        if (session.showCards) {
          this.mantionedCards = this.getMantionedCards(session.cards);
        }
      },
      () => {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
      },
    );
  }

  public setCard(value) {
    this.socketService.planningVote(this.session?.id, value);
  }

  public openCards() {
    this.socketService.showPlanningCards(this.projectId, this.session.id);
  }

  public closeSession(value) {
    this.socketService.setPlanningPoints(this.projectId, this.session.id, this.taskId, value);
  }

  public resetCards() {
    this.socketService.resetPlanningCards(this.projectId, this.session.id, this.session.task.id);
  }

  private getMantionedCards(cards) {
    return cards.reduce((result, card) => {
      const resultCard = result.find((r) => r.value === card.value);
      if (!resultCard) {
        result.push({ value: card.value, count: 1 });
        return result;
      }
      resultCard.count += 1;
      return result;
    }, []);
  }
}
