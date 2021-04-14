/* eslint-disable no-param-reassign */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RetroService } from 'src/app/services/retro.service';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.less'],
})
export class RetroComponent implements OnInit {
  private projectId: number;
  public retro;
  constructor(private activatedRoute: ActivatedRoute, private retroService: RetroService) {}

  public ngOnInit(): void {
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

  public scale(block, event) {
    if (event.keyCode === 8 || event.keyCode === 46) {
      return;
    }
    const step = 0.1;
    const minfs = 9;
    const sch = block.scrollHeight;
    const h = block.offsetHeight;

    if (sch > h) {
      const fontsize =
        parseInt(getComputedStyle(block, null).getPropertyValue('font-size'), 10) - step;
      if (fontsize >= minfs) {
        block.style.fontSize = `${fontsize}px`;
        this.scale(block, event);
        return;
      }
      block.innerText = block.innerText.slice(0, block.innerText.length - 1);
      this.placeCaretAtEnd(block);
    }
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
