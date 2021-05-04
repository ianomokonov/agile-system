import { Injectable } from '@angular/core';
import { RetroCardCategory } from 'back/src/models/retro-card-category';
import { AuthSocket } from './auth-socket';

@Injectable()
export class SocketService {
  constructor(private socket: AuthSocket) {}

  // --------------------------- DAILY ------------------------------------

  public enterDaily(projectId: number, dailyId: number) {
    this.socket.emit('enterDaily', { projectId, dailyId });
  }
  public leaveDaily() {
    this.socket.emit('leaveDaily');
  }
  public dailyNext(projectId: number, dailyId: number) {
    this.socket.emit('dailyNext', { projectId, dailyId });
  }
  public startDaily(projectId: number, dailyId: number) {
    this.socket.emit('startDaily', { projectId, dailyId });
  }
  public stopDaily(projectId: number, dailyId: number) {
    this.socket.emit('stopDaily', { projectId, dailyId });
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

  // --------------------------- DAILY ------------------------------------

  // --------------------------- RETRO ------------------------------------

  public enterRetroRoom(projectId: number, retroId) {
    this.socket.emit('enterRetro', { projectId, retroId });
  }

  public leaveRetroRoom(retroId) {
    this.socket.emit('leaveRetro', retroId);
  }

  public addRetroCard(projectId: number, retroId, category: RetroCardCategory) {
    this.socket.emit('addRetroCard', { projectId, retroId, category });
  }

  public removeRetroCard(cardId: number) {
    this.socket.emit('removeRetroCard', cardId);
  }

  public updateRetroCard(cardId: number, request) {
    this.socket.emit('updateRetroCard', { cardId, request });
  }

  public finishRetro(projectId: number, retroId: number) {
    this.socket.emit('finishRetro', { projectId, retroId });
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

  // --------------------------- RETRO ------------------------------------

  // --------------------------- DEMO ------------------------------------

  public enterDemoRoom(projectId: number, demoId) {
    this.socket.emit('enterDemo', { projectId, demoId });
  }

  public activeDemoTask(taskId) {
    this.socket.emit('activeDemoTask', taskId);
  }

  public acceptDemoTask(projectId: number, taskId) {
    this.socket.emit('acceptDemoTask', { projectId, taskId });
  }

  public reopenDemoTask(projectId: number, taskId) {
    this.socket.emit('reopenDemoTask', { projectId, taskId });
  }

  public finishDemo(projectId: number) {
    this.socket.emit('finishDemo', projectId);
  }

  public onActiveDemoTask() {
    return this.socket.fromEvent<any>('activeDemoTask');
  }

  public onAcceptDemoTask() {
    return this.socket.fromEvent<any>('acceptDemoTask');
  }

  public onFinishDemo() {
    return this.socket.fromEvent<any>('finishDemo');
  }

  // --------------------------- DEMO ------------------------------------

  // --------------------------- PLANNING ------------------------------------

  public enterPlanningRoom(projectId: number, planningId) {
    this.socket.emit('enterPlanning', { projectId, planningId });
  }

  public leavePlanningRoom() {
    this.socket.emit('leavePlanning');
  }

  public takePlanningTask(projectId: number, taskId, sprintId) {
    this.socket.emit('takePlanningTask', { projectId, taskId, sprintId });
  }

  public removePlanningTask(projectId: number, taskId) {
    this.socket.emit('removePlanningTask', { projectId, taskId });
  }

  public startPocker(projectId: number, taskId) {
    this.socket.emit('startPocker', { projectId, taskId });
  }

  public planningVote(sessionId, points) {
    this.socket.emit('planningVote', { sessionId, points });
  }

  public showPlanningCards(projectId: number, sessionId) {
    this.socket.emit('showPlanningCards', { projectId, sessionId });
  }

  public resetPlanningCards(projectId: number, sessionId, taskId) {
    this.socket.emit('resetPlanningCards', { projectId, sessionId, taskId });
  }

  public setPlanningPoints(projectId: number, sessionId, taskId, points) {
    this.socket.emit('setPlanningPoints', { projectId, sessionId, taskId, points });
  }

  public startPlanningSprint(sprintId, projectId) {
    this.socket.emit('startPlanningSprint', { sprintId, projectId });
  }

  public of(eventName: string) {
    return this.socket.fromEvent<any>(eventName);
  }

  // --------------------------- PLANNING ------------------------------------
}
