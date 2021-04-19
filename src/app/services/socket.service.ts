import { Injectable } from '@angular/core';
import { AuthSocket } from './auth-socket';

@Injectable()
export class SocketService {
  constructor(private socket: AuthSocket) {}

  public enterDaily(dailyId: number) {
    this.socket.emit('enterDaily', dailyId);
  }
  public leaveDaily() {
    this.socket.emit('leaveDaily');
  }
  public dailyNext(dailyId: number) {
    this.socket.emit('dailyNext', dailyId);
  }
  public startDaily(dailyId: number) {
    this.socket.emit('startDaily', dailyId);
  }
  public stopDaily(dailyId: number) {
    this.socket.emit('stopDaily', dailyId);
  }
  public pauseDaily(dailyId: number) {
    this.socket.emit('pauseDaily', dailyId);
  }
  public resumeDaily(dailyId: number) {
    this.socket.emit('resumeDaily', dailyId);
  }
  public newParticipant() {
    return this.socket.fromEvent('participantEntered');
  }
  public onStopDaily() {
    return this.socket.fromEvent('stopDaily');
  }

  public dailyTime() {
    return this.socket.fromEvent<string[]>('dailyTime');
  }

  public dailyPause() {
    return this.socket.fromEvent<void>('pauseDaily');
  }

  public dailyResume() {
    return this.socket.fromEvent<void>('resumeDaily');
  }

  public participantExit() {
    return this.socket.fromEvent<number>('participantExit');
  }

  public nextDailyParticipant() {
    return this.socket.fromEvent<{ isLast: boolean; participants: any[] }>('nextDailyParticipant');
  }
}
