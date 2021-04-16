/* eslint-disable no-param-reassign */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RetroCardCategory } from 'back/src/models/retro-card-category';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RetroService } from 'src/app/services/retro.service';

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
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.cardInput$.pipe(debounceTime(200)).subscribe((card) => {
      this.retroService
        .updateCard(this.projectId, card.id, {
          text: card.text,
          fontSize: card.fontSize,
        })
        .subscribe();
    });
    this.activatedRoute.params.subscribe((params) => {
      if (params.retroId) {
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
    this.retroService.createCard(this.projectId, this.retro.id, { category }).subscribe(() => {
      this.getRetro(this.retro.id);
    });
  }

  // eslint-disable-next-line complexity
  public scale(block, event, card) {
    const step = 0.1;
    const minfs = 9;
    const maxfs = 15;
    const sch = block.offsetHeight;
    const h = block.parentElement.offsetHeight;

    if (event.inputType === 'deleteContentBackward') {
      if (sch + 15 <= h) {
        const fontsize = (+card.fontSize || 16) + step;

        if (fontsize <= maxfs) {
          block.style.fontSize = `${fontsize}px`;
          card.fontSize = fontsize;

          this.scale(block, event, card);
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

        this.scale(block, event, card);
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
    this.retroService.removeCard(this.projectId, cardId).subscribe(() => {
      this.retro.cards = this.retro.cards.filter((card) => card.id !== cardId);
    });
  }

  public complete() {
    this.retroService.finish(this.projectId, this.retro.id).subscribe(() => {
      this.router.navigate(['../../', 'board'], { relativeTo: this.activatedRoute });
    });
  }

  public completePoint(card) {
    this.retroService
      .updateCard(this.projectId, card.id, {
        isCompleted: card.isCompleted,
        completeRetroId: card.isCompleted ? this.retro.id : null,
      })
      .subscribe();
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
