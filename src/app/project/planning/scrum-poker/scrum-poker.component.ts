import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public showResultValue: boolean;
  public mantionedCards: { value: number; count: number }[] = [];
  private projectId: number;
  private planningId: number;
  private taskId: number;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
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
    this.projectService.getPlanningSession(id, planningId, taskId).subscribe(
      (session) => {
        this.session = session;
        if (this.session.resultValue) {
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
    this.projectService.setSessionCard(this.projectId, this.session?.id, value).subscribe(() => {
      this.getSession({
        id: this.projectId,
        taskId: this.session.task.id,
        planningId: this.planningId,
      });
    });
  }

  public openCards() {
    this.projectService.setShowCards(this.projectId, this.session.id, true).subscribe(() => {
      this.session.showCards = true;
      this.mantionedCards = this.getMantionedCards(this.session.cards);
    });
  }

  public closeSession(value) {
    this.projectService
      .closeSession(this.projectId, this.session.id, value, this.taskId)
      .subscribe(() => {
        this.session.resultValue = value;
        this.showResultValue = true;
      });
  }

  public resetCards() {
    this.projectService.resetCards(this.projectId, this.session.id).subscribe(() => {
      this.session.cards = [];
      this.activeMark = false;
      this.session.showCards = false;
      this.mantionedCards = [];
    });
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
