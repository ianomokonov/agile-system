import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DailyService } from 'src/app/services/daily.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.less'],
})
export class DailyComponent implements OnInit, OnDestroy {
  public time = '00:00';
  public dailyTime = '00:00';
  public lastParticipant = false;
  public isPaused = false;
  public get nextParticipants() {
    return this.daily?.participants?.filter((p) => !p.isActive && !p.isDone);
  }
  public daily;
  public projectId: number;
  constructor(
    private socketService: SocketService,
    private activatedRoute: ActivatedRoute,
    private dailyService: DailyService,
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.projectId = params.id;
        this.getDaily();
      }
    });
  }

  public ngOnDestroy() {
    this.socketService.leaveDaily();
  }

  public getDaily() {
    this.dailyService.read(this.projectId).subscribe((daily) => {
      this.daily = daily;
      this.socketService.enterDaily(daily.id);
    });
  }

  public ngOnInit(): void {
    this.socketService.newParticipant().subscribe((m) => {
      this.daily.participants = m;
      if (!this.nextParticipants?.length) {
        this.lastParticipant = true;
        return;
      }
      this.lastParticipant = false;
    });
    this.socketService.nextDailyParticipant().subscribe((parts) => {
      this.daily.participants = parts;

      this.lastParticipant = !this.nextParticipants?.length;
      this.daily.isActive = true;
    });
    this.socketService.participantExit().subscribe((id: number) => {
      this.daily.participants = this.daily.participants.filter((p) => p.id !== id);
    });
    this.socketService.dailyPause().subscribe(() => {
      this.isPaused = true;
    });
    this.socketService.dailyResume().subscribe(() => {
      this.isPaused = false;
    });
    this.socketService.participantExit().subscribe((id: number) => {
      this.daily.participants = this.daily.participants.filter((p) => p.id !== id);
    });
    this.socketService.onStopDaily().subscribe(() => {
      this.getDaily();
    });

    this.socketService.dailyTime().subscribe(([time, activeTime]) => {
      this.dailyTime = time;
      this.time = activeTime;
    });
  }

  public start() {
    if (!this.daily?.participants?.length) {
      return;
    }
    if (this.daily.isActive) {
      this.socketService.resumeDaily(this.daily.id);
      return;
    }
    this.socketService.startDaily(this.daily?.id);
    this.daily.isActive = true;
  }
  public next() {
    this.socketService.dailyNext(this.daily.id);
  }
  public getTime() {
    return this.time?.toString();
  }
  public getDailyTime() {
    return this.dailyTime;
  }
  public pause() {
    this.socketService.pauseDaily(this.daily?.id);
  }
  public stop() {
    this.socketService.stopDaily(this.daily.id);
  }
  public getParticipantsCount() {
    return `${this.daily?.participants?.length} ${this.getParticipantsCountLabel(
      this.daily?.participants.length,
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
