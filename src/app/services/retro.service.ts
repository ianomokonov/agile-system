import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class RetroService {
  private readonly baseUrl = `${environment.baseUrl}/project`;
  constructor(private http: HttpClient) {}

  public start(projectId: number, sprintId: number): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/${projectId}/retro/start`, { sprintId });
  }

  public read(projectId: number, retroId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${projectId}/retro/${retroId}`);
  }

  public finish(projectId: number, retroId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${projectId}/retro/${retroId}/finish`);
  }

  public updateCard(projectId: number, cardId: number, card): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${projectId}/retro/update-card/${cardId}`, card);
  }

  public createCard(projectId: number, retroId: number, card): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/${projectId}/retro/${retroId}/create-card`, card);
  }

  public removeCard(projectId: number, cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${projectId}/retro/remove-card/${cardId}`);
  }
}
