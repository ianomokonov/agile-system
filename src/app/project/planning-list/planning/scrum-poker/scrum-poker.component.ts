import { Component } from '@angular/core';

@Component({
  selector: 'app-scrum-poker',
  templateUrl: './scrum-poker.component.html',
  styleUrls: ['./scrum-poker.component.less'],
})
export class ScrumPokerComponent {
  public marks = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];
  public activeMark = 8;
  public showCards = false;
}
