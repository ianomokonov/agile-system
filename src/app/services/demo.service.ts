import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class DemoService {
  private readonly baseUrl = `${environment.baseUrl}/project`;
  constructor(private http: HttpClient) {}

  public start(projectId: number, sprintId: number): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/${projectId}/demo/start`, { sprintId });
  }

  public read(projectId: number, demoId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${projectId}/demo/${demoId}`);
  }

  public finish(projectId: number, demoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${projectId}/demo/${demoId}/finish`);
  }

  public finishTask(projectId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${projectId}/demo/finish-task/${taskId}`);
  }
}
