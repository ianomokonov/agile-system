/* eslint-disable no-param-reassign */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserShortView } from 'back/src/models/responses/user-short-view';
import { RetroCardCategory } from 'back/src/models/retro-card-category';
import { Subject } from 'rxjs';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectService } from 'src/app/services/project.service';
import { RetroService } from 'src/app/services/retro.service';
import { SocketService } from 'src/app/services/socket.service';
import { CreateTaskComponent } from '../project-board/create-task/create-task.component';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.less'],
})
export class RetroComponent implements OnInit {
  private projectId: number;
  public retro;
  public cardCategory = RetroCardCategory;
  private cardInput$: Subject<any> = new Subject();
  private users: UserShortView[] = [];

  public get goodCards() {
    return this.retro?.cards.filter((c) => c.category === RetroCardCategory.Good);
  }
  public get badCards() {
    return this.retro?.cards.filter((c) => c.category === RetroCardCategory.Bad);
  }
  public get improvmentCards() {
    return this.retro?.cards.filter((c) => c.category === RetroCardCategory.Improvment);
  }
  public get actionCards() {
    return this.retro?.cards.filter((c) => c.category === RetroCardCategory.Actions);
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private retroService: RetroService,
    private socketService: SocketService,
    private modalService: NgbModal,
    private projectDataService: ProjectDataService,
    private projectService: ProjectService,
    private router: Router,
  ) {
    this.socketService.onAddRetroCard().subscribe((card) => {
      this.retro?.cards.push(card);
    });
    this.socketService.onRemoveRetroCard().subscribe((cardId) => {
      this.retro.cards = this.retro.cards.filter((c) => c.id !== cardId);
    });
    this.socketService.onUpdateRetroCard().subscribe((card) => {
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
    this.socketService.onFinishRetro().subscribe(() => {
      this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
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
        this.projectService
          .addTask(this.projectDataService.project.id, task)
          .subscribe((taskId) => {
            card.taskId = taskId;
          });
      })
      .catch(() => {});
  }

  public ngOnInit(): void {
    this.cardInput$.subscribe((card) => {
      this.socketService.updateRetroCard(card.id, {
        text: card.text,
        fontSize: card.fontSize,
      });
    });
    this.activatedRoute.params.subscribe((params) => {
      if (params.retroId) {
        this.socketService.enterRetroRoom(params.retroId);
        this.projectId = params.id;
        this.getRetro(params.retroId);
      }
    });
  }

  public getRetro(id: number) {
    this.retroService.read(this.projectId, id).subscribe((retro) => {
      this.retro = retro;
    });
  }

  public createCard(category: RetroCardCategory) {
    this.socketService.addRetroCard(this.retro.id, category);
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
    // this.retroService.removeCard(this.projectId, cardId).subscribe(() => {
    //   this.retro.cards = this.retro.cards.filter((card) => card.id !== cardId);
    // });
    this.socketService.removeRetroCard(cardId);
  }

  public complete() {
    // this.retroService.finish(this.projectId, this.retro.id).subscribe(() => {
    //   this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
    // });
    this.socketService.finishRetro(this.retro.id);
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
