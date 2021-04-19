import { Injectable } from '@angular/core';
import { RetroCardCategory } from 'back/src/models/retro-card-category';
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

  public enterRetroRoom(retroId) {
    this.socket.emit('enterRetro', retroId);
  }

  public leaveRetroRoom(retroId) {
    this.socket.emit('leaveRetro', retroId);
  }

  public addRetroCard(retroId, category: RetroCardCategory) {
    this.socket.emit('addRetroCard', { retroId, category });
  }

  public removeRetroCard(cardId: number) {
    this.socket.emit('removeRetroCard', cardId);
  }

  public updateRetroCard(cardId: number, request) {
    this.socket.emit('updateRetroCard', { cardId, request });
  }

  public finishRetro(retroId: number) {
    this.socket.emit('finishRetro', retroId);
  }

  public onAddRetroCard() {
    return this.socket.fromEvent<any>('addRetroCard');
  }

  public onRemoveRetroCard() {
    return this.socket.fromEvent<number>('removeRetroCard');
  }

  public onUpdateRetroCard() {
    return this.socket.fromEvent<any>('updateRetroCard');
  }

  public onFinishRetro() {
    return this.socket.fromEvent<any>('finishRetro');
  }
}
