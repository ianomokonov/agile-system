/* eslint-disable no-param-reassign */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Permissions } from 'back/src/models/permissions';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { RetroCardCategory } from 'back/src/models/retro-card-category';
import { forkJoin, Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';
import { RetroService } from 'src/app/services/retro.service';
import { SocketService } from 'src/app/services/socket.service';
import { TaskService } from 'src/app/services/task.service';
import { CreateTaskComponent } from '../project-board/create-task/create-task.component';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.less'],
})
export class RetroComponent implements OnInit, OnDestroy {
  private rxAlive = true;
  private projectId: number;
  public retro;
  public permissions = Permissions;
  public cardCategory = RetroCardCategory;
  private cardInput$: Subject<any> = new Subject();
  private users: UserShortView[] = [];
  private points: any[] = [];
  private myPointsCount = 0;

  public get goodCards() {
    return this.retro?.cards.filter((c) => c.category === RetroCardCategory.Good) || [];
  }
  public get badCards() {
    return this.retro?.cards.filter((c) => c.category === RetroCardCategory.Bad) || [];
  }
  public get improvmentCards(): any[] {
    return this.retro?.cards.filter((c) => c.category === RetroCardCategory.Improvment) || [];
  }
  public get actionCards() {
    return this.retro?.cards.filter((c) => c.category === RetroCardCategory.Actions) || [];
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private retroService: RetroService,
    private socketService: SocketService,
    private modalService: NgbModal,
    public projectDataService: ProjectDataService,
    private projectService: ProjectService,
    private router: Router,
    private taskService: TaskService,
  ) {
    this.socketService
      .onAddRetroCard()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((card) => {
        this.retro?.cards.push(card);
      });
    this.socketService
      .onRemoveRetroCard()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((cardId) => {
        this.retro.cards = this.retro.cards.filter((c) => c.id !== cardId);
        this.setCardsPoints();
      });
    this.socketService
      .onUpdateRetroCard()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((card) => {
        const curCard =
          this.retro?.cards.find((c) => c.id === card.cardId) ||
          this.retro?.oldCards.find((c) => c.id === card.cardId);

        if (curCard) {
          Object.keys(curCard).forEach((key) => {
            if (key in card.request) {
              curCard[key] = card.request[key];
            }
          });
        }
      });
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.projectService.getProject(params.id).subscribe((project) => {
          this.users = project.users;
        });
      }
    });
    this.socketService
      .onFinishRetro()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
      });
    this.socketService
      .of('setCardPoint')
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.getPoints(this.retro?.id)
          .pipe(takeWhile(() => this.rxAlive))
          .subscribe((points) => {
            this.points = points;
            this.setCardsPoints();
          });
      });
  }

  public onCreateTask(card) {
    const modal = this.modalService.open(CreateTaskComponent);
    modal.componentInstance.users = this.users;
    modal.componentInstance.patchValue({
      description: card.text,
      projectSprintId: this.retro.sprintId,
    });
    modal.result
      .then((task) => {
        this.taskService.addTask(this.projectDataService.project.id, task).subscribe((taskId) => {
          card.taskId = taskId;
        });
      })
      .catch(() => {});
  }

  public setPoints(card) {
    if (!card.hasMy && this.myPointsCount > 2) {
      return;
    }
    this.socketService.setRetroPoint(card.id);
  }

  private setCardsPoints() {
    this.myPointsCount = 0;
    this.improvmentCards.forEach((cardTemp) => {
      const card = cardTemp;
      const cardPoints = this.points?.filter((p) => p.cardId === card.id);
      card.points = cardPoints?.length || 0;
      card.hasMy = !!cardPoints.find((p) => p.isMy);
      if (card.hasMy) {
        this.myPointsCount += 1;
      }
    });
  }

  public ngOnInit(): void {
    this.cardInput$.pipe(takeWhile(() => this.rxAlive)).subscribe((card) => {
      this.socketService.updateRetroCard(card.id, {
        text: card.text,
        fontSize: card.fontSize,
      });
    });
    this.activatedRoute.params.pipe(takeWhile(() => this.rxAlive)).subscribe((params) => {
      this.projectId = params.id;

      if (params.retroId) {
        this.socketService.enterRetroRoom(this.projectId, params.retroId);
        this.projectId = params.id;
        this.getRetro(params.retroId);
      }
    });
  }

  public ngOnDestroy(): void {
    this.rxAlive = false;
  }

  public getRetro(id: number) {
    forkJoin([this.retroService.read(this.projectId, id), this.getPoints(id)])
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(([retro, points]) => {
        this.retro = retro;
        this.points = points;
        this.setCardsPoints();
      });
  }

  public getPoints(retroId: number) {
    return this.retroService.getPoints(this.projectId, retroId);
  }

  public createCard(category: RetroCardCategory) {
    const cards = this.retro?.cards.filter((c) => c.category === category);
    if (
      (cards[cards.length - 1]?.text == null || cards[cards.length - 1]?.text === '') &&
      cards.length !== 0
    ) {
      return;
    }

    this.socketService.addRetroCard(this.projectId, this.retro.id, category);
  }

  // eslint-disable-next-line complexity
  public scale(block, event, card, taskId) {
    const step = 0.1;
    const minfs = 9;
    const maxfs = 15;
    const sch = block.offsetHeight;
    const h = taskId ? block.parentElement.offsetHeight - 18 : block.parentElement.offsetHeight;

    if (event.inputType === 'deleteContentBackward') {
      if (sch + 15 <= h) {
        const fontsize = (+card.fontSize || 16) + step;

        if (fontsize <= maxfs) {
          block.style.fontSize = `${fontsize}px`;
          card.fontSize = fontsize;

          this.scale(block, event, card, taskId);
          card.text = block.innerText;
          this.cardInput$.next(card);
          return;
        }
        block.innerText = block.innerText.slice(0, block.innerText.length - 1);
        this.placeCaretAtEnd(block);
      }
      card.text = block.innerText;
      this.cardInput$.next(card);
      return;
    }

    if (sch > h) {
      const fontsize = (+card.fontSize || 16) - step;

      if (fontsize >= minfs) {
        card.fontSize = fontsize;
        block.style.fontSize = `${fontsize}px`;

        this.scale(block, event, card, taskId);
        card.text = block.innerText;
        this.cardInput$.next(card);
        return;
      }
      block.innerText = block.innerText.slice(0, block.innerText.length - 1);
      this.placeCaretAtEnd(block);
    }
    card.text = block.innerText;
    this.cardInput$.next(card);
  }

  public onCardClick(event) {
    if (event.target.nodeName === 'DIV') {
      this.placeCaretAtEnd(event.target.firstChild);
    }
  }

  public onRemoveCard(cardId) {
    // this.retroService.removeCard(this.projectId, cardId).pipe(takeWhile(() => this.rxAlive)).subscribe(() => {
    //   this.retro.cards = this.retro.cards.filter((card) => card.id !== cardId);
    // });
    this.socketService.removeRetroCard(cardId);
  }

  public complete() {
    // this.retroService.finish(this.projectId, this.retro.id).pipe(takeWhile(() => this.rxAlive)).subscribe(() => {
    //   this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
    // });
    this.socketService.finishRetro(this.projectId, this.retro.id);
  }

  public completePoint(card) {
    this.socketService.updateRetroCard(card.id, {
      isCompleted: card.isCompleted,
      completeRetroId: card.isCompleted ? this.retro.id : null,
    });
  }

  private placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else if (typeof (document.body as any).createTextRange !== 'undefined') {
      const textRange = (document.body as any).createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }
}
