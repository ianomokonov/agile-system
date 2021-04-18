import { Component, OnInit } from '@angular/core';
import { Time } from './time';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.less'],
})
export class DailyComponent implements OnInit {
  public started = false;
  public time: Time;
  public dailyTime: Time;
  public interval;
  public lastParticipant = false;
  public get nextParticipants() {
    return this.participants.filter((p) => !p.isActive && !p.isDone);
  }
  public participants = [
    { name: 'Иван Номоконов', isActive: false, isDone: false },
    { name: 'Иван Номоконов', isActive: false, isDone: false },
    { name: 'Иван Номоконов', isActive: false, isDone: false },
    { name: 'Иван Номоконов', isActive: false, isDone: false },
    { name: 'Иван Номоконов', isActive: false, isDone: false },
    { name: 'Иван Номоконов', isActive: false, isDone: false },
    { name: 'Иван Номоконов', isActive: false, isDone: false },
    { name: 'Иван Номоконов', isActive: false, isDone: false },
    { name: 'Иван Номоконов', isActive: false, isDone: false },
    { name: 'Иван Номоконов', isActive: false, isDone: false },
  ];
  constructor() {}

  ngOnInit(): void {}

  public start() {
    if (!this.participants?.length) {
      return;
    }
    if (!this.time) {
      this.time = new Time(0, 0, 0);
    }
    if (!this.dailyTime) {
      this.dailyTime = new Time(0, 0, 0);
    }
    this.started = true;
    this.interval = setInterval(() => {
      this.time.updateSecond(this.time.second + 1);
      this.dailyTime.updateSecond(this.dailyTime.second + 1);
    }, 1000);
    this.participants[this.participants.length - 1].isActive = true;
    if (this.participants.length === 1) {
      this.lastParticipant = true;
    }
  }
  public next() {
    this.pause();
    const activeIndex = this.participants.findIndex((p) => p.isActive);
    if (activeIndex < 0) {
      this.participants[this.participants.length - 1].isActive = true;
      if (this.participants.length === 1) {
        this.lastParticipant = true;
      }
      return;
    }
    this.participants[activeIndex].isActive = false;
    this.participants[activeIndex].isDone = true;
    if (this.participants[activeIndex - 1]) {
      this.participants[activeIndex - 1].isActive = true;
      this.time = new Time(0, 0, 0);
      this.interval = setInterval(() => {
        this.time.updateSecond(this.time.second + 1);
        this.dailyTime.updateSecond(this.dailyTime.second + 1);
      }, 1000);
    }
    if (activeIndex - 1 === 0) {
      this.lastParticipant = true;
    }
  }
  public getTime() {
    return this.time.toString();
  }
  public getDailyTime() {
    return this.dailyTime.toString();
  }
  public pause() {
    clearInterval(this.interval);
    this.interval = null;
  }
  public getParticipantsCount() {
    return `${this.participants?.length} ${this.getParticipantsCountLabel(
      this.participants.length,
    )}`;
  }

  private getParticipantsCountLabel(count) {
    switch (count % 10) {
      case 1: {
        return 'участник';
      }
      case 2:
      case 3:
      case 4: {
        return 'участника';
      }
      default: {
        return 'участников';
      }
    }
  }
}
